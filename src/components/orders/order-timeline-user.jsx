import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { CheckCircle2, Circle } from "lucide-react";
import PropTypes from "prop-types";

// Timeline component
const OrderTimelineUser = ({ timeline }) => {
  return (
    <VStack align="stretch" spacing={6}>
      {timeline?.map((step, index) => {
        const isLast = index === timeline?.length - 1;
        return (
          <Box key={step.status} position="relative">
            {/* Timeline line */}
            {!isLast && (
              <Box
                position="absolute"
                left="15px"
                top="32px"
                width="2px"
                height="64px"
                bg={step.completed ? "teal.500" : "gray.200"}
              />
            )}

            <HStack align="flex-start" spacing={4}>
              {/* Timeline node */}
              <Box
                position="relative"
                zIndex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="32px"
                height="32px"
                borderRadius="full"
                border="2px solid"
                borderColor={step.completed ? "teal.500" : "gray.300"}
                bg={step.completed ? "teal.500" : "white"}
              >
                {step.completed ? (
                  <CheckCircle2 size={20} color="white" />
                ) : (
                  <Circle size={12} color="gray" />
                )}
              </Box>

              {/* Timeline content */}
              <Box flex={1}>
                <Text
                  fontWeight="medium"
                  color={step.completed ? "gray.900" : "gray.500"}
                >
                  {step.title}
                </Text>
                <Text
                  fontSize="sm"
                  color={step.completed ? "gray.600" : "gray.400"}
                >
                  {step.description}
                </Text>
                {step.timestamp && (
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    {new Date(step.timestamp).toLocaleString("vi-VN")}
                  </Text>
                )}
              </Box>
            </HStack>
          </Box>
        );
      })}
    </VStack>
  );
};
OrderTimelineUser.propTypes = {
  timeline: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      completed: PropTypes.bool,
      title: PropTypes.string,
      description: PropTypes.string,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default OrderTimelineUser;
