import { Box, Button, createStyles, makeStyles, MenuItem, TextField, Theme } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useEffect } from "react";
import { useState } from "react";
import { ICartItem } from "src/types";
import useScreenSize from "use-screen-size";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  item: ICartItem;
  handleUpdateQuantity: (productId: number, quantity: number, index: number) => void;
  index: number;
}

const QuantityControlls = ({ item, handleUpdateQuantity, index }: Props) => {
  const classes = useStyles();
  const screenSize = useScreenSize();
  const [inputValue, setInputValue] = useState(item.quantity);
  const STOCK = 20;

  const debouncedUpdate = useDebouncedCallback((value) => {
    handleUpdateQuantity(item.productId, value, index);
  }, 500);

  useEffect(() => {
    setInputValue(item.quantity);
  }, [item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = Number(e.target.value);
    if (targetValue > STOCK) {
      setInputValue(STOCK);
      debouncedUpdate(STOCK);
      return;
    }
    setInputValue(targetValue);
    if (!!targetValue) {
      debouncedUpdate(targetValue);
    }
  };

  return screenSize.width <= 768 ? (
    <Box className={classes.quantity}>
      <TextField
        size="small"
        select
        value={item.quantity}
        defaultValue={item.quantity}
        inputProps={{ style: { textAlign: "center" } }}
        className={classes.inputMobile}
        color="primary"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleUpdateQuantity(item.productId, Number(e.target.value), index)
        }
        variant="outlined"
        aria-label="quantity"
      >
        {new Array(STOCK).fill(0).map((e, index) => (
          <MenuItem key={index + 1} value={index + 1}>
            {index + 1}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  ) : (
    <Box className={classes.quantity}>
      {item.quantity === 1 ? (
        <Button aria-label="reduce" disabled>
          <RemoveIcon fontSize="small" />
        </Button>
      ) : (
        <Button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, index)} aria-label="reduce">
          <RemoveIcon fontSize="small" />
        </Button>
      )}
      <TextField
        size="small"
        value={inputValue}
        className={classes.input}
        type="number"
        inputProps={{ min: 1, max: STOCK, style: { textAlign: "center" } }}
        color="primary"
        onFocus={(e) => {
          e.target.select();
        }}
        onChange={handleInputChange}
        variant="outlined"
        aria-label="quantity"
      ></TextField>
      {item.quantity >= STOCK ? (
        <Button disabled aria-label="increase">
          <AddIcon color="disabled" fontSize="small" />
        </Button>
      ) : (
        <Button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, index)} aria-label="increase">
          <AddIcon fontSize="small" />
        </Button>
      )}
    </Box>
  );
};

export default QuantityControlls;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    quantity: {
      display: "flex",
      justifyContent: "center",
      "@media(max-width: 600px)": {
        display: "flex",
      },
    },
    removeBtn: {
      "@media(max-width: 600px)": {
        top: 0,
        right: -15,
        position: "absolute",
      },
    },
    input: {
      width: "70px",
      textAlign: "center",
      // removes arrows of the number input
      "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none",
      },
    },
    inputMobile: {
      width: "80%",
      textAlign: "center",
    },
  })
);
