import {
    Box,
    Table,
    Tbody,
    Td,
    Tr,
    Text,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Tab,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { getOptionsSizeByUnit, groupedAttributeExtension, optionsUnit } from "../../../const/enum";

export const GroupedAttributeDisplay = ({ attribute = [], unit, size, description }) => {
    // Map attr -> category
    const attrToCategoryMap = {};
    groupedAttributeExtension.forEach((group) => {
        group.attributes.forEach((attr) => {
            attrToCategoryMap[attr] = group.category;
        });
    });

    // Gom attribute theo category
    const grouped = {};
    attribute.forEach((attr) => {
        const category = attrToCategoryMap[attr];
        if (category) {
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(attr);
        }
    });

    return (
        <Box borderWidth="1px" borderRadius="md" overflow="hidden" mt={6}>
            <Tabs variant="enclosed">
                <TabList>
                    <Tab>Thông số</Tab>
                    <Tab>Mô tả</Tab>
                </TabList>

                <TabPanels>
                    {/* Tab thông số */}
                    <TabPanel>
                        <Table variant="simple" size="md">

                            <Tbody>
                                {/* Hiển thị các nhóm thuộc tính */}
                                {Object.entries(grouped).map(([category, values]) => (
                                    <Tr key={category}>
                                        <Td fontWeight="semibold">{category}</Td>
                                        <Td>
                                            {values.map((value, index) => (
                                                <Text as="span" key={index}>
                                                    {value}
                                                    {index < values.length - 1 ? ", " : ""}
                                                </Text>
                                            ))}
                                        </Td>
                                    </Tr>
                                ))}

                                {/* Đơn vị */}
                                {unit && (
                                    <Tr>
                                        <Td fontWeight="semibold">Đơn vị</Td>
                                        <Td>{optionsUnit.find(u => u.value == unit).label}</Td>
                                    </Tr>
                                )}

                                {/* Kích cỡ */}
                                {size && (
                                    <Tr>
                                        <Td fontWeight="semibold">Kích cỡ</Td>
                                        <Td>{getOptionsSizeByUnit(unit).find(s => s.value == size).label}</Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </TabPanel>

                    {/* Tab mô tả */}
                    <TabPanel>
                        <Text>{description}</Text>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

GroupedAttributeDisplay.propTypes = {
    attribute: PropTypes.array,
    unit: PropTypes.string,
    size: PropTypes.string,
    description: PropTypes.string,
};

