import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "src/contexts/UserContext";

const Cart = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <div>Cart</div>
    </div>
  );
};

export default Cart;
