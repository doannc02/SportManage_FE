import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { UserContext } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

function CreditCardForm({ onCardInfoChange }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const toast = useToast();

  useEffect(() => {
    setTotal(user.totalPrice || 0);
  }, [user.totalPrice]);

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "Nguyễn Văn A",
    focus: "",
    bank: "Techcombank",
  });

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    const newState = { ...state, [name]: value };

    setState(newState);

    if (onCardInfoChange) {
      onCardInfoChange(newState);
    }
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const { number, expiry, cvc, name, bank } = state;

    if (!number || !expiry || !cvc || !name || !bank) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const examplePromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(200);
        navigate("/");
      }, 3000);
    });

    toast.promise(examplePromise, {
      success: {
        title: "Thanh toán thành công!",
        description: "Cảm ơn bạn đã mua hàng 🎁",
      },
      error: {
        title: "Lỗi thanh toán",
        description: "Vui lòng thử lại sau.",
      },
      loading: {
        title: "Đang xử lý thanh toán",
        description: "Vui lòng không tắt trình duyệt...",
      },
    });
  };

  return (
    <Box w="100%" mx="auto" p={6}>
      <Text size="lg" textAlign="start" mb={6}>
        Thông tin thẻ
      </Text>

      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        {/* Left Column: Card Preview + Extra Info */}
        <Box flex="1">
          <Cards
            number={state.number}
            expiry={state.expiry}
            cvc={state.cvc}
            name={state.name}
            focused={state.focus}
          />
          {/* Extra content below card */}
          <Box mt={4} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
            <Text fontWeight="bold" mb={2}>Thông tin thêm</Text>
            <Text>Tổng thanh toán: <strong>{total.toLocaleString()} VND</strong></Text>
            <Text fontSize="sm" color="gray.500" mt={2}>Thông tin của bạn được bảo mật và mã hóa an toàn.</Text>
          </Box>
        </Box>

        {/* Right Column: Form */}
        <Box flex="1" bg="white" borderRadius="xl" boxShadow="md" p={6} as="form" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="medium">Số thẻ</FormLabel>
              <Input
                type="number"
                name="number"
                placeholder="**** **** **** ****"
                value={state.number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="medium">Ngày hết hạn</FormLabel>
              <Input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={state.expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="medium">CVC</FormLabel>
              <Input
                type="text"
                name="cvc"
                placeholder="CVC"
                value={state.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="medium">Tên chủ thẻ</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="Nguyễn Văn A"
                value={state.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="medium">Ngân hàng</FormLabel>
              <Select
                name="bank"
                placeholder="Chọn ngân hàng"
                value={state.bank}
                onChange={handleInputChange}
              >
                <option value="Vietcombank">Vietcombank</option>
                <option value="Techcombank">Techcombank</option>
                <option value="VPBank">VPBank</option>
                <option value="BIDV">BIDV</option>
                <option value="ACB">ACB</option>
                <option value="MB Bank">MB Bank</option>
                <option value="VietinBank">VietinBank</option>
                <option value="Sacombank">Sacombank</option>
                <option value="TPBank">TPBank</option>
              </Select>
            </FormControl>

          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

export default CreditCardForm;
