import React from "react";
import SVGCheck from "./SvgCheck";
import { PostCheckoutContainer } from "./styled";
import PostCheckout from "../../components/PostCheckout";
const PostCheckoutPage = () => {
  return (
    <PostCheckoutContainer>
      <SVGCheck />
      <PostCheckout />
    </PostCheckoutContainer>
  );
};

export default PostCheckoutPage;
