import PropTypes from "prop-types";
import { Button, Card, CardBody, Grid, HStack, Input, InputGroup, InputLeftElement, Select, Text, VStack } from "@chakra-ui/react";
import { RefreshCw, Search } from "lucide-react";
import { ORDER_STATES } from "../../../../const/enum";

export const OrderFilters = ({ filters, onFiltersChange, onReset }) => {

    // handleChange will call onFiltersChange with the updated filter value
    const handleChange = (key, value) => {
        if (onFiltersChange) {
            onFiltersChange({
                ...filters,
                [key]: value
            });
        }
    };

    return (
        <Card>
            <CardBody>
                <VStack align="stretch" spacing={4}>
                    <HStack>
                        <Text fontWeight="bold">Bộ lọc</Text>
                        <Button size="sm" variant="ghost" onClick={onReset} leftIcon={<RefreshCw size={16} />}>
                            Đặt lại
                        </Button>
                    </HStack>

                    <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
                        <InputGroup>
                            <InputLeftElement>
                                <Search size={16} />
                            </InputLeftElement>
                            <Input
                                placeholder="Tìm kiếm đơn hàng, khách hàng..."
                                value={filters.searchTerm || ''}
                                onChange={(e) => handleChange('searchTerm', e.target.value)}
                            />
                        </InputGroup>

                        <Select
                            placeholder="Tất cả trạng thái"
                            value={filters.state || ''}
                            onChange={(e) => handleChange('state', e.target.value)}
                        >
                            {Object.entries(ORDER_STATES).map(([key, config]) => (
                                <option key={key} value={key}>{config.label}</option>
                            ))}
                        </Select>

                        <Input
                            type="date"
                            placeholder="Từ ngày"
                            value={filters.fromDate || ''}
                            onChange={(e) => handleChange('fromDate', e.target.value)}
                        />

                        <Input
                            type="date"
                            placeholder="Đến ngày"
                            value={filters.toDate || ''}
                            onChange={(e) => handleChange('toDate', e.target.value)}
                        />
                    </Grid>
                </VStack>
            </CardBody>
        </Card>
    );
};

OrderFilters.propTypes = {
    filters: PropTypes.shape({
        searchTerm: PropTypes.string,
        state: PropTypes.string,
        fromDate: PropTypes.string,
        toDate: PropTypes.string,
    }).isRequired,
    onFiltersChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
};