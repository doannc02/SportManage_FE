export const getLabelValueOptions = (items) =>{
    return items?.map((item) => ({
        value: item,
        label: item,
      })) || []
}