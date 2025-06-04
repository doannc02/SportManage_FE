import { authApi } from "../../configs/auth";


// export const sendMessage = (content: string) => {
//   return axios.post(`${API_URL}/api/messages`, { content });
// };

// export const getConversations = () => {
//     return axios.get(`${API_URL}/api/messages`);
// };
export const getConversations = async () => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/messages',
    })
    return data
}

export const getConversationDetail = async (conversationId) => {
    const { data } = await authApi({
        method: 'get',
        url: `/api/messages/${conversationId}`,
    })
    return data
}

export const sendMessage = async (
    content
) => {
    const { data } = await authApi({
        method: 'post',
        url: '/api/messages',
        data: {
            content
        }
    })
    return data
}