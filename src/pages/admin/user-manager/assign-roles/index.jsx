import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    CheckboxGroup,
    FormControl,
    FormLabel,
    Heading,
    Spinner,
    Stack,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import Select from "react-select";
import { updateUserRoles, useQueryRoles, useQueryUserList } from "../../../../services/admins/users";
import { useMutation } from "react-query";

const RoleAssignment = () => {
    const toast = useToast();
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    const { data: userListData, isLoading: isLoadingUsers, refetch } = useQueryUserList({
        pageNumber: 0,
        pageSize: 1000,
        keyword: "",
    });

    const { data: roleListData, isLoading: isLoadingRoles } = useQueryRoles();

    // Tạo danh sách options cho react-select
    const userOptions =
        userListData?.items?.map((item) => ({
            value: item.user.id,
            label: `${item.user.username} (${item.user.email})`,
            roles: item.roles,
        })) ?? [];

    // Khi user được chọn
    const handleUserChange = (selectedOption) => {
        if (!selectedOption) {
            setSelectedUserId("");
            setSelectedRoles([]);
            return;
        }
        console.log(selectedOption, '======select======')
        setSelectedUserId(selectedOption.value);
        setLoadingRoles(true);

        const userRolesFromUserList = selectedOption.roles || [];

        const matchedRoleIds =
            userRolesFromUserList.map((ur) =>
                roleListData?.items?.find((r) => r.name === ur.name)?.id
            ) ?? [];

        setSelectedRoles(matchedRoleIds.filter(Boolean));
        setLoadingRoles(false);
    };

    const { mutate } = useMutation(updateUserRoles, {
        onSuccess: () => {
            toast({
                title: "Đã lưu",
                description: `Đã cập nhật quyền cho người dùng.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            refetch()
        },
        onError: () => {
            toast({
                title: "Lỗi",
                description: "Không thể cập nhật quyền cho người dùng.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    });

    const handleSubmit = () => {
        if (!selectedUserId) return;

        mutate({
            userId: selectedUserId,
            roleIds: selectedRoles,
        });
    };

    return (
        <Box maxW="3xl" mx="auto" mt={10} p={4}>
            <Card boxShadow="xl" borderRadius="2xl">
                <CardHeader borderBottom="1px solid #eee">
                    <Heading size="md" textAlign="center">
                        🛡️ Phân quyền người dùng
                    </Heading>
                </CardHeader>
                <CardBody>
                    <VStack spacing={6} align="stretch">
                        <FormControl>
                            <FormLabel fontWeight="bold">Chọn người dùng</FormLabel>
                            {isLoadingUsers || isLoadingRoles ? (
                                <Spinner />
                            ) : (
                                <Select
                                    placeholder="-- Tìm kiếm người dùng --"
                                    options={userOptions}
                                    onChange={handleUserChange}
                                    isClearable
                                />
                            )}
                        </FormControl>

                        <Box>
                            <Text fontWeight="bold" mb={2}>
                                Danh sách quyền
                            </Text>
                            {loadingRoles || isLoadingRoles ? (
                                <Spinner />
                            ) : (
                                <CheckboxGroup
                                    value={selectedRoles}
                                    onChange={(val) => setSelectedRoles(val)}
                                >
                                    <Stack spacing={2}>
                                        {roleListData?.items?.map((role) => (
                                            <Checkbox key={role.id} value={role.id}>
                                                {role.name}
                                            </Checkbox>
                                        ))}
                                    </Stack>
                                </CheckboxGroup>
                            )}
                        </Box>

                        <Button
                            colorScheme="teal"
                            size="lg"
                            onClick={handleSubmit}
                            isDisabled={!selectedUserId}
                            borderRadius="xl"
                            mt={4}
                        >
                            💾 Lưu thay đổi
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default RoleAssignment;
