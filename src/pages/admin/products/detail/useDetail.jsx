import { useNavigate, useParams } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { useMutation } from "react-query"
import { useToast } from "@chakra-ui/react"
import { useEffect, useMemo } from "react"
import { useQueryProductsDetail, saveProduct } from "../../../../services/customers/products"
import { useQueryCategoryList } from "../../../../services/admins/categories"
import { useQueryBrandsList } from "../../../../services/admins/brands"
import { useQuerySuppliersList } from "../../../../services/admins/suppliers"
import CoreInput from "../../../../components/atoms/CoreInput"
import CoreAutoComplete from "../../../../components/atoms/CoreAutoComplete"
import { MultiImageUploader } from "../../../../components/atoms/ImageUploader"
import { CoreGroupAttributes } from "../../../../components/atoms/CoreGroupAttributes"
import { getOptionsSizeByUnit, groupedAttributeExtension, optionsColor, optionsUnit } from "../../../../const/enum"


export const defaultProductValues = {
    name: '',
    variants: [{
        price: 0,
        attribute: []
    }],
    productCategories: [],
    images: []
};

const useDetailProduct = () => {

    const navigate = useNavigate()
    const toast = useToast()
    const { id } = useParams()

    const methodForm = useForm({ defaultValues: defaultProductValues })
    const { control, handleSubmit, setValue, watch, getValues, reset } = methodForm

    // Queries
    const { data: dataCategory, isLoading: isLoadingCategory } = useQueryCategoryList({ keyword: '', sizeNumber: 20, pageNumber: 0 })
    const { data: dataBrands, isLoading: isLoadingBrand } = useQueryBrandsList({ keyword: '', sizeNumber: 20, pageNumber: 0 })
    const { data: dataSuppliers, isLoading: isLoadingSuppliers } = useQuerySuppliersList({ keyword: '', sizeNumber: 20, pageNumber: 0 })

    const { data: detailData, refetch } = useQueryProductsDetail({ id }, { enabled: !!id })

    const { mutate, isLoading: isLoadingSubmit } = useMutation(saveProduct, {
        onError: (err) => toast({ title: "Lỗi", description: err.message, status: "error" }),
        onSuccess: (res) => {
            navigate(`/products/detail/${res.id}`);
            refetch()
            toast({ title: "Thành công", description: !id ? "Thêm mới thành công!" : "Chỉnh sửa thành công!", status: "success" })
        }
    })

    // Form arrays
    const { fields, append, remove } = useFieldArray({ name: 'variants', control, keyName: 'key' })
    const { fields: fieldProductCategories, append: appendProdCategory, remove: removeProdCategory } = useFieldArray({ name: 'productCategories', control, keyName: 'key' })

    // Column config
    const columnVariants = useMemo(() => [
        { header: "Image", fieldName: "image", styleCell: { style: { minWidth: 350 } } },
        { header: <>Product <span style={{ color: "red" }}>*</span></>, fieldName: "productName" },
        { header: "Sku", fieldName: "sku" },
        { header: <>Unit <span style={{ color: "red" }}>*</span></>, fieldName: "unit" },
        { header: <>Color <span style={{ color: "red" }}>*</span></>, fieldName: "color" },
        { header: <>Price <span style={{ color: "red" }}>*</span></>, fieldName: "price" },
        { header: <>Size <span style={{ color: "red" }}>*</span></>, fieldName: "size" },
        { header: <>Input qty <span style={{ color: "red" }}>*</span></>, fieldName: "stockQuantity" },
        { header: <>Attribute <span style={{ color: "red" }}>*</span></>, fieldName: "attribute" },
        { header: "Action", fieldName: "action" },
    ], [])

    const renderInput = (name, placeholder, rules = {}, type = "text") => (
        <CoreInput key={name} control={control} name={name} placeholder={placeholder} type={type} required rules={rules} />
    )


    const dataTableVariant = fields.map((item, index) => {

        return ({
            image: <MultiImageUploader
                height={'45px'}
                defaultValue={getValues(`variants.${index}.images`)}
                onChange={(urls) => setValue(`variants.${index}.images`, urls)}
            />,
            productName: renderInput(`variants.${index}.name`, "Nhập tên sản phẩm", { required: "Trường này là bắt buộc!" }),
            sku: renderInput(`variants.${index}.sku`, "Mã SKU", { required: "Trường này là bắt buộc!" }),
            unit: <CoreAutoComplete control={control} name={`variants.${index}.unit`} placeholder='Chọn đơn vị' options={optionsUnit} />,
            color: <CoreAutoComplete control={control} name={`variants.${index}.color`} placeholder='Chọn màu sắc' options={optionsColor} />,
            size: <CoreAutoComplete control={control} name={`variants.${index}.size`} valuePath="value" placeholder='Chọn size' options={getOptionsSizeByUnit(watch(`variants.${index}.unit`))} />,
            price: renderInput(`variants.${index}.price`, "Giá", { required: "Trường này là bắt buộc!" }, "number"),
            stockQuantity: renderInput(`variants.${index}.stockQuantity`, "Số lượng nhập", { required: "Trường này là bắt buộc!" }, "number"),
            description: <CoreInput
                autoExpandEmpty={true}
                key={name}
                multiline
                label={`Mô tả cho sản phẩm ${getValues(`variants.${index}.name`)}`}
                control={control} name={`variants.${index}.description`}
                placeholder={`Nhập mô tả cho sản phẩm ${getValues(`variants.${index}.name`)}`}
            />,
            attribute: (
                <CoreGroupAttributes
                    name={`variants.${index}.attribute`}
                    control={control}
                    groups={groupedAttributeExtension}
                    label="Chọn thuộc tính" />
            ),
            action: <button key={item.key} type="button" onClick={(e) => {
                e.stopPropagation()
                remove(index)
            }}>Xoá</button>
        });
    });



    const onSubmit = handleSubmit((input) => {
        const { categoryIds, ...rest } = input
        const selectedCategories = categoryIds.map((id) => ({ id }))
        const data = { ...rest, productCategories: [...selectedCategories, ...input.productCategories] }

        mutate({
            method: id ? "put" : "post",
            input: id ? input : data
        })
    })

    useEffect(() => {
        if (detailData && id) {
            reset({
                ...detailData,
                images: detailData?.images,
                categoryIds: (detailData?.productCategories ?? []).map((i) => {
                    return {
                        value: i.category.id,
                        label: i.category.name
                    }
                })
            })
        }
    }, [detailData, id])

    return [{
        id,
        methodForm,
        columnVariants,
        dataTableVariant,
        dataCategory,
        dataBrands,
        isLoadingBrand,
        isLoadingCategory,
        fieldProductCategories,
        dataSuppliers,
        isLoadingSuppliers,
        isLoadingSubmit
    }, {
        append,
        onSubmit,
        appendProdCategory,
        removeProdCategory,
        setValue,
        watch
    }]
}

export default useDetailProduct
