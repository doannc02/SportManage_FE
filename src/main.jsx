import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query'
import { UserProvider } from './Contexts/UserContext'
import FloatingChatButton from './pages/ChatPage.jsx'
import { ChatProvider } from './Contexts/ChatContext.jsx'
//import ChatInterface from './components/chats/FloatingButton/index.jsx'



const queryClient = new QueryClient()
const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
    <UserProvider>
        <ChatProvider>
            <QueryClientProvider client={queryClient}>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                />
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <ChakraProvider>
                            <App />
                            <FloatingChatButton />
                        </ChakraProvider>
                    </ThemeProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </ChatProvider>
    </UserProvider>
)
