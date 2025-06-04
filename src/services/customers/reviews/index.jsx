import { authApi } from "../../../configs/auth"

export const submitReview = async (
    { reviewId, productId, rating, comment, parentCommentId }
) => {
    const { data } = await authApi({
        method: 'post',
        url: '/api/products/review',
        data: { reviewId, productId, rating, comment, parentCommentId },
    })
    return data
}


export const submitReviewComment = async (
    { reviewId, comment, parentCommentId }
) => {
    const { data } = await authApi({
        method: 'post',
        url: '/api/products/comment',
        data: { reviewId, comment, parentCommentId },
    })
    return data
}
