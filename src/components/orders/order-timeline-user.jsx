import { Box, HStack, Text, VStack, Collapse, useDisclosure } from "@chakra-ui/react";
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight,
  Truck,
} from "lucide-react";
import PropTypes from "prop-types";
import { SHIPPING_TIMELINE_STEPS } from "../../const/enum";

// Shipping status sub-timeline data


// Sub-timeline component for shipping status
const ShippingSubTimeline = ({ currentShippingStatus, shippingHistories = [] }) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  // Determine which steps are completed based on current shipping status
  const getCompletedShippingSteps = () => {
    const statusOrder = ["PickedUp", "InTransit", "OutForDelivery", "Delivered"];
    const currentIndex = statusOrder.indexOf(currentShippingStatus);
    
    return SHIPPING_TIMELINE_STEPS.map((step, _) => {
      let isCompleted = false;
      let timestamp = null;
      
      // Check if this step is completed based on status order
      if (currentShippingStatus === "Failed" && step.status === "Failed") {
        isCompleted = true;
      } else if (currentShippingStatus !== "Failed") {
        const stepIndex = statusOrder.indexOf(step.status);
        isCompleted = stepIndex <= currentIndex && stepIndex !== -1;
      }
      
      // Find timestamp from shipping histories
      const historyEntry = shippingHistories.find(h => h.status === step.status);
      if (historyEntry) {
        timestamp = historyEntry.timestamp;
      }
      
      return {
        ...step,
        completed: isCompleted,
        timestamp
      };
    }).filter(step => {
      // Filter out irrelevant steps
      if (currentShippingStatus === "Failed") {
        return step.status === "Failed" || step.status === "PickedUp" || step.status === "InTransit";
      }
      return step.status !== "Failed";
    });
  };

  const shippingSteps = getCompletedShippingSteps();

  return (
    <Box ml={8} mt={3} p={4} bg="blue.50" borderRadius="lg" border="1px" borderColor="blue.200">
      <HStack 
        spacing={2} 
        cursor="pointer" 
        onClick={onToggle}
        _hover={{ bg: "blue.100" }}
        p={2}
        borderRadius="md"
        transition="all 0.2s"
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <Truck size={16} color="blue" />
        <Text fontWeight="medium" color="blue.700" fontSize="sm">
          Chi tiết vận chuyển
        </Text>
      </HStack>
      
      <Collapse in={isOpen}>
        <VStack align="stretch" spacing={4} mt={4} pl={2}>
          {shippingSteps.map((step, index) => {
            const isLast = index === shippingSteps.length - 1;
            const IconComponent = step.icon;
            
            return (
              <Box key={step.status} position="relative">
                {/* Sub-timeline line */}
                {!isLast && (
                  <Box
                    position="absolute"
                    left="11px"
                    top="24px"
                    width="2px"
                    height="48px"
                    bg={step.completed ? "blue.400" : "gray.200"}
                  />
                )}

                <HStack align="flex-start" spacing={3}>
                  {/* Sub-timeline node */}
                  <Box
                    position="relative"
                    zIndex={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="24px"
                    height="24px"
                    borderRadius="full"
                    border="2px solid"
                    borderColor={step.completed ? "blue.400" : "gray.300"}
                    bg={step.completed ? "blue.400" : "white"}
                  >
                    {step.completed ? (
                      <CheckCircle2 size={14} color="white" />
                    ) : (
                      <IconComponent size={10} color="gray" />
                    )}
                  </Box>

                  {/* Sub-timeline content */}
                  <Box flex={1}>
                    <Text
                      fontWeight="medium"
                      fontSize="sm"
                      color={step.completed ? "blue.800" : "gray.500"}
                    >
                      {step.title}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={step.completed ? "blue.600" : "gray.400"}
                    >
                      {step.description}
                    </Text>
                    {step.timestamp && (
                      <Text fontSize="xs" color="blue.500" mt={1}>
                        {new Date(step.timestamp).toLocaleString("vi-VN")}
                      </Text>
                    )}
                  </Box>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      </Collapse>
    </Box>
  );
};

// Enhanced Timeline component
const OrderTimelineUser = ({ timeline, currentShippingStatus, shippingHistories }) => {
  return (
    <VStack align="stretch" spacing={6}>
      {timeline?.map((step, index) => {
        const isLast = index === timeline?.length - 1;
        const isShippedStep = step.status === "Shipped";
        const showShippingDetails = isShippedStep && step.completed && currentShippingStatus;
        
        return (
          <Box key={step.status} position="relative">
            {/* Timeline line */}
            {!isLast && (
              <Box
                position="absolute"
                left="15px"
                top="32px"
                width="2px"
                height={showShippingDetails ? "120px" : "64px"}
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
                
                {/* Show shipping sub-timeline when at Shipped step */}
                {showShippingDetails && (
                  <ShippingSubTimeline 
                    currentShippingStatus={currentShippingStatus}
                    shippingHistories={shippingHistories}
                  />
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
  currentShippingStatus: PropTypes.string,
  shippingHistories: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
      location: PropTypes.string,
    })
  ),
};

ShippingSubTimeline.propTypes = {
  currentShippingStatus: PropTypes.string,
  shippingHistories: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
      location: PropTypes.string,
    })
  ),
};

export default OrderTimelineUser;