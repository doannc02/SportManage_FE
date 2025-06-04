import { useRef, useState, useCallback, useEffect } from 'react';
import {
    Box,
    Button,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Progress,
    Text,
    VStack,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Spinner,
    IconButton,
    Tooltip,
    useBreakpointValue,
    Stack,
    Flex
} from '@chakra-ui/react';
import { Camera } from 'react-camera-pro';
import {
    FiCamera,
    FiRotateCcw,
    FiZoomIn,
    FiZoomOut,
    FiUpload,
    FiX
} from 'react-icons/fi';
import PropTypes from 'prop-types';
import { FlipHorizontal } from 'lucide-react';
import { authApi } from '../../../configs/auth';

const CameraModal = ({
    isOpen,
    onClose,
    onCapture,
    onUploadSuccess,
    uploadEndpoint = '/api/upload-image',
    maxFileSize = 5 * 1024 * 1024, // 5MB
    allowedFormats = ['image/jpeg', 'image/png', 'image/webp'],
    quality = 0.8,
    aspectRatio = 16 / 9
}) => {
    const cameraRef = useRef(null);
    const toast = useToast();

    // Responsive breakpoints
    const isMobile = useBreakpointValue({ base: true, md: false });
    const modalSize = useBreakpointValue({ base: 'full', md: '4xl', lg: '6xl' });
    const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });
    const iconButtonSize = useBreakpointValue({ base: 'sm', md: 'md' });
    const cameraHeight = useBreakpointValue({ base: '300px', sm: '350px', md: '500px', lg: '600px', xl: '700px' });
    const spacing = useBreakpointValue({ base: 2, md: 4, lg: 6 });

    // States
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [cameraError, setCameraError] = useState(null);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' for front camera
    const [zoom, setZoom] = useState(1);
    const [isLandscape, setIsLandscape] = useState(false);

    // Detect orientation change
    useEffect(() => {
        const handleOrientationChange = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        handleOrientationChange();
        window.addEventListener('resize', handleOrientationChange);
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('resize', handleOrientationChange);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    // Camera error handler
    const handleCameraError = useCallback((error) => {
        console.error('Camera error:', error);
        setCameraError(error);
        toast({
            title: 'Lỗi Camera',
            description: 'Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }, [toast]);

    // Capture photo
    const handleCapture = useCallback(() => {
        try {
            if (!cameraRef.current) {
                throw new Error('Camera không khả dụng');
            }

            const photo = cameraRef.current.takePhoto();
            if (!photo) {
                throw new Error('Không thể chụp ảnh');
            }

            setImage(photo);
            toast({
                title: 'Chụp ảnh thành công',
                status: 'success',
                duration: 2000,
            });
        } catch (error) {
            console.error('Capture error:', error);
            toast({
                title: 'Lỗi chụp ảnh',
                description: error.message,
                status: 'error',
                duration: 3000,
            });
        }
    }, [toast]);

    // Convert base64 to blob
    const base64ToBlob = useCallback((base64, mimeType) => {
        const byteCharacters = atob(base64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }, []);

    // Validate image
    const validateImage = useCallback((blob) => {
        if (blob.size > maxFileSize) {
            throw new Error(`Kích thước ảnh quá lớn. Tối đa ${Math.round(maxFileSize / 1024 / 1024)}MB`);
        }

        if (!allowedFormats.includes(blob.type)) {
            throw new Error(`Định dạng không được hỗ trợ. Chỉ chấp nhận: ${allowedFormats.join(', ')}`);
        }

        return true;
    }, [maxFileSize, allowedFormats]);

    // Upload image with progress
    const uploadImage = useCallback(async (imageData) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Convert base64 to blob
            const blob = base64ToBlob(imageData, 'image/jpeg');
            validateImage(blob);

            // Create form data
            const formData = new FormData();
            const fileName = `capture_${Date.now()}.jpg`;
            formData.append('files', blob, fileName);
            formData.append('timestamp', Date.now().toString());
            formData.append('quality', quality.toString());

            // Simulate upload progress (replace with real XMLHttpRequest for actual progress)
            const res = await authApi({
                method: 'post',
                url: '/api/upload-image',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(progress); // Cập nhật % lên UI
                    }
                },
            });

            toast({
                title: 'Upload thành công',
                description: 'Ảnh đã được tải lên server',
                status: 'success',
                duration: 3000,
            });

            // Call success callbacks
            onCapture && onCapture(imageData);
            onUploadSuccess && onUploadSuccess(res);

            return res;

        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Upload thất bại',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            throw error;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [
        base64ToBlob,
        validateImage,
        uploadEndpoint,
        quality,
        onCapture,
        onUploadSuccess,
        toast
    ]);

    // Confirm and upload
    const handleConfirm = useCallback(async () => {
        if (!image) return;

        try {
            await uploadImage(image);
            onClose();
            resetStates();
        } catch (error) {
            // Error already handled in uploadImage
        }
    }, [image, uploadImage, onClose]);

    // Switch camera
    const switchCamera = useCallback(() => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    }, []);

    // Zoom controls
    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + 0.1, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev - 0.1, 1));
    }, []);

    // Reset all states
    const resetStates = useCallback(() => {
        setImage(null);
        setCameraError(null);
        setUploadProgress(0);
        setZoom(1);
    }, []);

    // Handle modal close
    const handleClose = useCallback(() => {
        if (isUploading) {
            toast({
                title: 'Đang upload',
                description: 'Vui lòng đợi quá trình upload hoàn tất',
                status: 'warning',
                duration: 3000,
            });
            return;
        }
        resetStates();
        onClose();
    }, [isUploading, resetStates, onClose, toast]);

    // Retake photo
    const handleRetake = useCallback(() => {
        setImage(null);
        setCameraError(null);
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size={modalSize}
            closeOnOverlayClick={!isUploading}
            motionPreset={isMobile ? 'slideInBottom' : 'scale'}
            scrollBehavior={isMobile ? 'inside' : 'outside'}
        >
            <ModalOverlay />
            <ModalContent
                maxW={isMobile ? '100vw' : '95vw'}
                maxH={isMobile ? '100vh' : '95vh'}
                minH={isMobile ? '100vh' : '80vh'}
                m={isMobile ? 0 : 4}
                borderRadius={isMobile ? 0 : 'lg'}
            >
                <ModalHeader py={isMobile ? 3 : 6}>
                    <Flex justify="space-between" align="center">
                        <Text fontSize={isMobile ? 'lg' : '2xl'} fontWeight="semibold">
                            Chụp ảnh xác nhận
                        </Text>
                        {isUploading && <Spinner size={isMobile ? 'sm' : 'md'} />}
                    </Flex>
                </ModalHeader>
                <ModalCloseButton isDisabled={isUploading} />

                <ModalBody p={isMobile ? 3 : 6} flex="1" overflow="auto">
                    {cameraError && (
                        <Alert status="error" mb={spacing} borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle fontSize={isMobile ? 'sm' : 'md'}>Lỗi Camera!</AlertTitle>
                                <AlertDescription fontSize={isMobile ? 'xs' : 'sm'}>
                                    {cameraError.message || 'Không thể truy cập camera'}
                                </AlertDescription>
                            </Box>
                        </Alert>
                    )}

                    {isUploading && (
                        <Box mb={spacing}>
                            <Text mb={2} fontSize={isMobile ? 'sm' : 'md'}>
                                Đang upload... {uploadProgress}%
                            </Text>
                            <Progress
                                value={uploadProgress}
                                colorScheme="blue"
                                borderRadius="md"
                                size={isMobile ? 'sm' : 'md'}
                            />
                        </Box>
                    )}

                    {!image ? (
                        <VStack spacing={spacing}>
                            <Box
                                position="relative"
                                height={cameraHeight}
                                width="100%"
                                borderRadius="md"
                                overflow="hidden"
                                bg="gray.900"
                                minH={isMobile ? '250px' : '300px'}
                            >
                                {!cameraError && (
                                    <>
                                        <Camera
                                            ref={cameraRef}
                                            aspectRatio={isMobile && !isLandscape ? 9 / 16 : aspectRatio}
                                            facingMode={facingMode}
                                            errorMessages={{
                                                noCameraAccessible: 'Không thể truy cập camera',
                                                permissionDenied: 'Bạn đã từ chối quyền truy cập camera',
                                                switchCamera: 'Không thể chuyển đổi camera',
                                                canvas: 'Không thể hiển thị camera'
                                            }}
                                            onError={handleCameraError}
                                        />

                                        {/* Camera Controls */}
                                        <Stack
                                            direction={isMobile ? "column" : "row"}
                                            position="absolute"
                                            top={isMobile ? 2 : 4}
                                            right={isMobile ? 2 : 4}
                                            spacing={isMobile ? 1 : 2}
                                        >
                                            <Tooltip label="Chuyển camera" placement={isMobile ? "left" : "bottom"}>
                                                <IconButton
                                                    size={iconButtonSize}
                                                    colorScheme="whiteAlpha"
                                                    icon={<FlipHorizontal size={isMobile ? 16 : 24} />}
                                                    onClick={switchCamera}
                                                />
                                            </Tooltip>
                                            <Tooltip label="Phóng to" placement={isMobile ? "left" : "bottom"}>
                                                <IconButton
                                                    size={iconButtonSize}
                                                    colorScheme="whiteAlpha"
                                                    icon={<FiZoomIn size={isMobile ? 16 : 24} />}
                                                    onClick={handleZoomIn}
                                                    isDisabled={zoom >= 3}
                                                />
                                            </Tooltip>
                                            <Tooltip label="Thu nhỏ" placement={isMobile ? "left" : "bottom"}>
                                                <IconButton
                                                    size={iconButtonSize}
                                                    colorScheme="whiteAlpha"
                                                    icon={<FiZoomOut size={isMobile ? 16 : 24} />}
                                                    onClick={handleZoomOut}
                                                    isDisabled={zoom <= 1}
                                                />
                                            </Tooltip>
                                        </Stack>

                                        {zoom > 1 && (
                                            <Text
                                                position="absolute"
                                                bottom={isMobile ? 2 : 4}
                                                left={isMobile ? 2 : 4}
                                                color="white"
                                                bg="blackAlpha.700"
                                                px={isMobile ? 2 : 3}
                                                py={1}
                                                borderRadius="md"
                                                fontSize={isMobile ? 'xs' : 'sm'}
                                                fontWeight="medium"
                                            >
                                                Zoom: {zoom.toFixed(1)}x
                                            </Text>
                                        )}
                                    </>
                                )}
                            </Box>

                            {/* Mobile helper text */}
                            {isMobile && (
                                <Text fontSize="xs" color="gray.500" textAlign="center" px={2}>
                                    {isLandscape ? 'Xoay dọc để có trải nghiệm tốt hơn' : 'Nhấn nút chụp ảnh bên dưới'}
                                </Text>
                            )}
                        </VStack>
                    ) : (
                        <Box textAlign="center">
                            <Image
                                src={image}
                                alt="Ảnh xác nhận"
                                maxW="100%"
                                maxH={isMobile ? '350px' : '600px'}
                                borderRadius="lg"
                                boxShadow="2xl"
                                mx="auto"
                            />
                            <Text
                                mt={2}
                                fontSize={isMobile ? 'xs' : 'sm'}
                                color="gray.600"
                            >
                                Kích thước: ~{Math.round(image.length * 0.75 / 1024)}KB
                            </Text>
                        </Box>
                    )}
                </ModalBody>

                <ModalFooter
                    p={isMobile ? 3 : 6}
                    borderTop={isMobile ? "1px solid" : "none"}
                    borderColor="gray.200"
                >
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={spacing}
                        w="100%"
                        justify="center"
                    >
                        {!image ? (
                            <>
                                <Button
                                    onClick={handleCapture}
                                    colorScheme="blue"
                                    leftIcon={<FiCamera size={isMobile ? 16 : 24} />}
                                    isDisabled={!!cameraError}
                                    size={buttonSize}
                                    w={isMobile ? "100%" : "auto"}
                                    order={isMobile ? 1 : 0}
                                    px={isMobile ? 4 : 8}
                                >
                                    Chụp ảnh
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    leftIcon={<FiX size={isMobile ? 16 : 24} />}
                                    size={buttonSize}
                                    w={isMobile ? "100%" : "auto"}
                                    variant={isMobile ? "outline" : "solid"}
                                    order={isMobile ? 2 : 1}
                                    px={isMobile ? 4 : 8}
                                >
                                    Hủy
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleRetake}
                                    leftIcon={<FiRotateCcw size={isMobile ? 16 : 24} />}
                                    isDisabled={isUploading}
                                    size={buttonSize}
                                    w={isMobile ? "100%" : "auto"}
                                    variant={isMobile ? "outline" : "solid"}
                                    order={isMobile ? 2 : 1}
                                    px={isMobile ? 4 : 8}
                                >
                                    Chụp lại
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    colorScheme="green"
                                    leftIcon={isUploading ? <Spinner size="xs" /> : <FiUpload size={isMobile ? 16 : 24} />}
                                    isLoading={isUploading}
                                    loadingText={isMobile ? "Uploading..." : "Đang upload..."}
                                    size={buttonSize}
                                    w={isMobile ? "100%" : "auto"}
                                    order={isMobile ? 1 : 0}
                                    px={isMobile ? 4 : 8}
                                >
                                    {isUploading ? `${uploadProgress}%` : isMobile ? 'Xác nhận' : 'Xác nhận & Upload'}
                                </Button>
                            </>
                        )}
                    </Stack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

CameraModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCapture: PropTypes.func,
    onUploadSuccess: PropTypes.func,
    uploadEndpoint: PropTypes.string,
    maxFileSize: PropTypes.number,
    allowedFormats: PropTypes.arrayOf(PropTypes.string),
    quality: PropTypes.number,
    aspectRatio: PropTypes.number,
};

export default CameraModal;