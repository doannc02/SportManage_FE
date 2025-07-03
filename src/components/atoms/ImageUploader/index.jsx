import {
    Box,
    IconButton,
    Image,
    Input,
    useToast,
    Flex,
    Tooltip,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../../../configs/auth';
import { Spin } from 'antd';

export const MultiImageUploader = ({
    isDisable = true,
    width = '80px',
    height = '80px',
    onChange,
    shouldReset = false,
    defaultValue = [],
}) => {
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    // Removed unused 'uploading' state
    const toast = useToast();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (defaultValue && defaultValue.length > 0) {
            setPreviews(defaultValue);
        }
    }, [JSON.stringify(defaultValue)]);

    const handleRemoveImage = async (index) => {
        // const removedUrl = previews[index];
        // if (typeof removedUrl === 'string' && removedUrl.startsWith('/uploads/')) {
        //     const fileName = removedUrl.split('/').pop();
        //     try {
        //         await authApi({
        //             method: 'delete',
        //             url: `/api/upload-image?fileName=${fileName}`
        //         });
        //     } catch (err) {
        //         toast({ title: 'Không thể xoá ảnh', description: err.message, status: 'error' });
        //     }
        // }
        const updated = previews.filter((_, i) => i !== index);
        setPreviews(updated);
        onChange(updated);
    };

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files?.length) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('files', file));
        // Removed 'setUploading' call

        try {
            setUploading(true);
            const res = await authApi({
                method: 'post',
                url: '/api/upload-image',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const uploadedUrls = res.data;
            const updated = [...previews, ...uploadedUrls];
            if (!shouldReset) setPreviews(updated);
            onChange(updated);
            toast({ title: 'Tải ảnh thành công', status: 'success' });
        } catch (err) {
            toast({ title: 'Tải ảnh thất bại', description: err.message, status: 'error' });
        } finally {
            setUploading(false);
            // Removed 'setUploading' call
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerUpload = () => fileInputRef.current?.click();

    return (
        <Spin spinning={uploading}>
            <Box p={2}>
                <Input
                    type="file"
                    accept="image/*"
                    multiple
                ref={fileInputRef}
                display="none"
                onChange={handleFileChange}
            />
            <Flex gap={3} wrap="nowrap" overflowX="auto">
                {(previews ?? []).map((src, index) => (
                    <Box
                        key={index}
                        position="relative"
                        minWidth={width}
                        height={height}
                        borderRadius="md"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        <Image
                            src={src.startsWith('http') ? src : `${src}`}
                            alt={`image-${index}`}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                        />
                        {isDisable && (
                            <IconButton
                                size="xs"
                                icon={<CloseIcon boxSize={2.5} />}
                                colorScheme="red"
                                position="absolute"
                                top="1"
                                right="1"
                                aria-label="Remove"
                                onClick={() => handleRemoveImage(index)}
                                borderRadius="full"
                                opacity="0.85"
                                _hover={{ opacity: 1 }}
                            />
                        )}
                    </Box>
                ))}

                {isDisable && (
                    <Flex
                        align="center"
                        justify="center"
                        minWidth={width}
                        height={height}
                        borderRadius="md"
                        border="2px dashed"
                        borderColor="gray.300"
                        cursor="pointer"
                        onClick={triggerUpload}
                        _hover={{ bg: 'gray.50' }}
                    >
                        <Tooltip label="Thêm ảnh">
                            <AddIcon boxSize={4} color="gray.500" />
                        </Tooltip>
                    </Flex>
                )}
            </Flex>

        </Box>
        </Spin>
    );
};

MultiImageUploader.propTypes = {
    isDisable: PropTypes.bool,
    width: PropTypes.string,
    height: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.array,
    shouldReset: PropTypes.bool,
};
