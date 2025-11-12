from selenium import webdriver
from bs4 import BeautifulSoup
import re 
import json
from datetime import date
import os
import time

# --- FUNCIONES AUXILIARES ---

def create_slug(text):
    """Genera un slug compatible con URL a partir de un texto."""
    text = text.lower().strip()
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'[^\w\-]', '', text)
    return text[:255]

def get_details(driver, url):
    """
    Va a la página de un producto y extrae precio, descripción e imagen.
    Recibe el 'driver' para no tener que crearlo de nuevo.
    """
    driver.get(url)
    soup = BeautifulSoup(driver.page_source, "lxml")

    price = 0.0
    description = "No encontrado"
    image_url = "No encontrado"
    
    # Bloque try except para precio
    try:
        price_class = "a-price-whole"
        decimals_price_class = "a-price-fraction"
        price_text1 = soup.find("span", class_=price_class).text
        price_text2 = soup.find("span", class_=decimals_price_class).text
        price_dirty = f"{price_text1}{price_text2}"
        price = float(price_dirty.replace(",", ""))
        print(f"Price: {price}")
    except Exception as e:
        print(f"Error al obtener precio para {url}: {e}")
        price = 0.0 # Importante para el filtro

    # Bloque try except para description
    try:
        description_id = "featurebullets_feature_div"
        description_class = "a-expander-content a-expander-partial-collapse-content"
        
        id_element = soup.find("div", id=description_id)
        if id_element:
            description = id_element.get_text(separator='\n', strip=True)
            print("Descripción encontrada por ID")
        else:
            class_element = soup.find("div", class_=description_class)
            if class_element:
                description = class_element.get_text(separator='\n', strip=True)
                print("Descripción encontrada por clase")
            else:
                print("No se encontró descripción ni por ID ni por clase")
    except Exception as e:
        print(f"Error al obtener descripción para {url}: {e}")
        description = "No encontrado"

    # Bloque try except para la imagen
    try:
        image_id = "landingImage"
        image_element = soup.find("img", id=image_id)
        if image_element:
            image_url = image_element.get("src")
            print(f"Image found: {image_url[:50]}...")
        else:
            print("No se encontró imagen con ID 'landingImage'")
    except Exception as e:
        print(f"Error al obtener imagen para {url}: {e}")
        image_url = "No encontrado"

    return {
        "price": price,
        "description": description,
        "image_url": image_url
    }

# --- FUNCIÓN PRINCIPAL DE SCRAPING (MODIFICADA) ---

# MODIFICADO: Añadido el parámetro 'product_link_class'
def get_product_list(driver, category_url, category_name, start_pk, limit_per_category, product_link_class):
    """
    Scrapea una URL de categoría, con un PK inicial y un límite.
    Devuelve: (lista_de_productos, proximo_pk_disponible)
    """
    driver.get(category_url)

    print(f"\n*** PAUSA PARA DEBUGGING ***")
    print(f"Revisa la ventana del navegador para la categoría: '{category_name}'")
    print("¿Ves productos o una página de 'Perro-Bot' (CAPTCHA)?")
    print("Si es un CAPTCHA, ¡resuélvelo manualmente en el navegador ahora!")
    time.sleep(2) # La espera donde suele salir el "perrito"

    print("Recargando la página para saltar el CAPTCHA...")
    driver.refresh() # ¡Aquí está el F5 automático!


    soup = BeautifulSoup(driver.page_source, "lxml")
    
    # MODIFICADO: Ya no está 'a_class' hardcodeado. Usa el parámetro.
    print(f"Buscando enlaces con la clase: '{product_link_class}'")
    a_tags = soup.find_all("a", class_=product_link_class)
    
    # NUEVO: Añadido el print de diagnóstico que teníamos antes, ¡es útil!
    print(f"Se encontraron {len(a_tags)} enlaces de producto.")

    products_list_data = []
    pk_counter = start_pk  # El PK continúa donde lo dejó el anterior
    products_found_in_this_category = 0 # Contador para el límite
    
    for a in a_tags:
        # 1. Comprobar si ya llegamos al límite de esta categoría
        if products_found_in_this_category >= limit_per_category:
            print(f"Límite de {limit_per_category} alcanzado para la categoría '{category_name}'.")
            break # Rompe el bucle for a in a_tags

        # 2. Obtener título y link
        title = a.text.replace("\n", "").strip()
        link = a.get("href")

        # 3. Filtrar enlaces no válidos (a veces 'a_tags' captura cosas raras)
        if not link or not link.startswith("/") or "slredirect" in link:
            continue
        
        print(f"\nProcesando (PK: {pk_counter}): {title[:50]}...")
        detail_link = "https://www.amazon.com.mx" + link

        # 4. Llamar a get_details (pasando el driver)
        details = get_details(driver, detail_link)
        
        # 5. VALIDACIÓN
        if details['price'] == 0.0:
            print(f"Omitiendo '{title[:50]}' (No se encontró precio o no está disponible)")
            continue # Salta a la siguiente 'a' en a_tags

        # 6. Si todo está bien, construir el fixture
        slug = create_slug(title)
        product_fixture = {
            "model": "product.product",
            "pk": pk_counter,
            "fields": {
                "title": title,
                "slug": slug,
                "description": details['description'],
                "price": details['price'],
                "imageUrl": details['image_url'],
                "category": category_name,
                "featured": False,
                "active": True,
                "timestamp": date.today().isoformat(),
                "is_digital": False
            }
        }
        
        # 7. Añadir a la lista y actualizar contadores
        products_list_data.append(product_fixture)
        pk_counter += 1                     # Incrementa el PK global
        products_found_in_this_category += 1  # Incrementa el contador de esta categoría

    # Devuelve los productos encontrados Y el siguiente PK que se debe usar
    return products_list_data, pk_counter 

# --- ================================== ---
# --- BLOQUE DE EJECUCIÓN PRINCIPAL (El "Cerebro") ---
# --- ================================== ---

# 1. Lista de configuración de "trabajos"
# MODIFICADO: Añadida la clave "link_class"
CATEGORIES_TO_SCRAPE = [
    {
        "name": "Mens clothing",
        "url": "https://www.amazon.com.mx/s?k=ropa+caballero&crid=43LVDHYGE27L&sprefix=ropa+caba%2Caps%2C518&ref=nb_sb_ss_ts-doa-p_2_9",
        "link_class": "a-link-normal s-line-clamp-2 s-line-clamp-3-for-col-12 s-link-style a-text-normal"
    },
    {
        "name": "GYM",
        "url": "https://www.amazon.com.mx/s?k=gym&crid=8JEAV3V4Z1W3&sprefix=%2Caps%2C128&ref=nb_sb_ss_recent_2_0_recent",
        "link_class": "a-link-normal s-line-clamp-4 s-link-style a-text-normal"
    },
    {
        "name": "Womens clothing",
        "url": "https://www.amazon.com.mx/s?k=ropa+dama&__mk_es_MX=ÅMÅŽÕÑ&crid=3S6VC47MEGWMH&sprefix=ropa+dama%2Caps%2C166&ref=nb_sb_noss_1",
        "link_class": "a-link-normal s-line-clamp-2 s-line-clamp-3-for-col-12 s-link-style a-text-normal"
    },
    {
        "name": "Cosmetics",
        "url": "https://www.amazon.com.mx/s?k=costmeticos&__mk_es_MX=ÅMÅŽÕÑ&crid=AY6J5XA5ZT9Y&sprefix=costmeticos%2Caps%2C153&ref=nb_sb_noss_2",
        "link_class": "a-link-normal s-line-clamp-4 s-link-style a-text-normal"
    }
]

# 2. Inicialización
all_products_master_list = []
current_global_pk = 1
LIMIT_PER_CATEGORY = 10 # Límite bajo para pruebas

# 3. Abrir el driver UNA SOLA VEZ
print("Iniciando driver de Selenium...")
driver = webdriver.Chrome()

# 4. El bucle principal
try:
    for category_job in CATEGORIES_TO_SCRAPE:
        # NUEVO: Extraer la 'link_class' del diccionario de trabajo
        category_name = category_job['name']
        category_url = category_job['url']
        link_class_from_config = category_job['link_class'] # <-- NUEVA LÍNEA
        
        print(f"\n--- INICIANDO CATEGORÍA: {category_name} (Iniciando en PK: {current_global_pk}) ---")
        
        # MODIFICADO: Pasar el nuevo parámetro 'product_link_class' a la función
        products_from_category, next_pk = get_product_list(
            driver=driver,
            category_url=category_url,
            category_name=category_name,
            start_pk=current_global_pk,
            limit_per_category=LIMIT_PER_CATEGORY,
            product_link_class=link_class_from_config # <-- NUEVO PARÁMETRO
        )
        
        # 5. Recolectar resultados y actualizar el PK
        all_products_master_list.extend(products_from_category)
        current_global_pk = next_pk
        
        print(f"--- CATEGORÍA TERMINADA: {category_name} | Productos añadidos: {len(products_from_category)} ---")

except Exception as e:
    print(f"\n*** ERROR CRÍTICO DURANTE EL SCRAPING: {e} ***")
finally:
    # 6. Cerrar el driver UNA SOLA VEZ al final
    print("\nCerrando driver de Selenium.")
    driver.close()

# 7. Escribir el archivo JSON
output_filename = "products_fixture_all_categories.json"
script_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(script_dir, output_filename)
try:
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_products_master_list, f, indent=4, ensure_ascii=False)
    
    print(f"\n--- ¡ÉXITO TOTAL! ---")
    print(f"Se generó el archivo en: '{output_path}' con {len(all_products_master_list)} productos en total.")

except Exception as e:
    print(f"\nError al escribir el archivo JSON: {e}")