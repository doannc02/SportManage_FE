import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    Radio,
    RadioGroup,
    Stack,
    Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";

export const CoreGroupAttributes = ({
    name,
    control,
    groups,
    label,
}) => {
    return (
        <Box>
            {label && (
                <Text fontWeight="bold" mb={1} fontSize="sm">
                    {label}
                </Text>
            )}

            <Controller
                control={control}
                name={name}
                render={({ field }) => {
                    // State nội bộ để giữ selected theo dạng object: { "Chiều dài": "680 mm", ... }
                    const [selectedMap, setSelectedMap] = useState({});

                    // Khi load lần đầu nếu field.value là mảng -> reset lại state
                    useEffect(() => {
                        if (Array.isArray(field.value)) {
                            const mapped = {};
                            (groups ?? []).forEach((group) => {
                                const match = field.value.find((v) =>
                                    group.attributes.includes(v)
                                );
                                if (match) mapped[group.category] = match;
                            });
                            setSelectedMap(mapped);
                        }
                    }, [field.value, groups]);

                    // Labels hiển thị
                    const selectedLabels = Object.values(selectedMap)
                        .slice(0, 2)
                        .join(", ") +
                        (Object.values(selectedMap).length > 2
                            ? ` +${Object.values(selectedMap).length - 2} nữa`
                            : "");

                    const updateSelected = (newMap) => {
                        setSelectedMap(newMap);
                        const selectedArray = Object.values(newMap).filter(Boolean);
                        field.onChange(selectedArray); // output là mảng
                    };

                    return (
                        <Menu closeOnSelect={false}>
                            <MenuButton
                                as={Button}
                                rightIcon={<ChevronDownIcon />}
                                variant="outline"
                                size="sm"
                                width="100%"
                                textAlign="left"
                                fontWeight="normal"
                            >
                                {selectedLabels || "Chọn thuộc tính"}
                            </MenuButton>

                            <MenuList
                                maxHeight="300px"
                                overflowY="auto"
                                p={2}
                                borderRadius="md"
                                boxShadow="lg"
                                minW="320px"
                            >
                                {(groups ?? []).map((group) => {
                                    const selectedValue = selectedMap[group.category] || "";

                                    return (
                                        <Box key={group.category} mb={3}>
                                            <Text fontWeight="semibold" fontSize="sm" mb={1}>
                                                {group.category}
                                            </Text>

                                            <Button
                                                size="xs"
                                                colorScheme="red"
                                                mb={2}
                                                onClick={() => {
                                                    const updated = { ...selectedMap };
                                                    delete updated[group.category];
                                                    updateSelected(updated);
                                                }}
                                            >
                                                Bỏ chọn
                                            </Button>

                                            <RadioGroup
                                                value={selectedValue}
                                                onChange={(val) => {
                                                    const isSame = selectedValue === val;
                                                    const updated = { ...selectedMap };

                                                    if (isSame) {
                                                        delete updated[group.category];
                                                    } else {
                                                        updated[group.category] = val;
                                                    }

                                                    updateSelected(updated);
                                                }}
                                            >
                                                <Stack spacing={2} pl={2}>
                                                    {group.attributes.map((attr) => (
                                                        <Radio key={attr} value={attr}>
                                                            {attr}
                                                        </Radio>
                                                    ))}
                                                </Stack>
                                            </RadioGroup>
                                        </Box>
                                    );
                                })}
                            </MenuList>
                        </Menu>
                    );
                }}
            />
        </Box>
    );
};
