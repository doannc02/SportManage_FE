import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";

export const DialogRemove = ({
    isOpen, cancelRef, onClose, selectedItemId, removeItem
}) => {
    return <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInBottom"
    >
        <AlertDialogOverlay>
            <AlertDialogContent
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                borderRadius="lg"
                mx={4}
            >
                <AlertDialogHeader fontSize="lg" fontWeight="bold" display="flex" alignItems="center">
                    <Icon as={FaTrash} color="red.500" mr={3} />
                    Xóa sản phẩm khỏi giỏ hàng
                </AlertDialogHeader>

                <AlertDialogBody>
                    Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng? Bạn sẽ cần thêm lại sản phẩm này nếu muốn mua sau này.
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        colorScheme="red"
                        ml={3}
                        leftIcon={<FaTrash />}
                        onClick={() => {
                            if (selectedItemId) removeItem({ cartItemId: selectedItemId });
                            onClose();
                        }}
                    >
                        Xóa sản phẩm
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
}
