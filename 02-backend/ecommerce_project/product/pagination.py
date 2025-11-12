from rest_framework.pagination import PageNumberPagination

class ProductPagination(PageNumberPagination):
    page_size = 4
    page_query_param = "p"
    page_size_query_param = "size"