// Page403.jsx
import { Typography, Breadcrumbs, Container, Box, Link as MuiLink } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { FaLock } from 'react-icons/fa'

const PageContainer = styled('div')({
    position: 'relative',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
})

const HeaderContainer = styled('div')({
    height: '30px',
    width: '100%',
    padding: '0 10px',
    position: 'absolute',
    top: 0,
    left: 0
})

const ContentContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    width: '550px'
})

const IconContainer = styled('div')({
    color: '#d32f2f',
    fontSize: '96px'
})

const CoreBreadcrumbs = ({ breadcrumbs }) => {
    return (
        <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((breadcrumb, index) => (
                <Typography key={index} color="text.primary">
                    {breadcrumb.title}
                </Typography>
            ))}
        </Breadcrumbs>
    )
}

const Page403 = () => {
    return (
        <PageContainer>
            <HeaderContainer>
                <CoreBreadcrumbs
                    breadcrumbs={[
                        {
                            title: '403',
                        },
                    ]}
                />
            </HeaderContainer>

            <ContentContainer>
                <IconContainer>
                    <FaLock />
                </IconContainer>

                <Typography variant="h5" align="center">
                    Không có quyền truy cập!
                </Typography>

                <Typography
                    variant="subtitle1"
                    align="center"
                    sx={{
                        marginTop: '4px',
                        textAlignLast: 'center',
                        lineHeight: '24px',
                    }}
                >
                    Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với bộ
                    phận hỗ trợ nếu điều này đáng lẽ không nên xảy ra.
                </Typography>

                <MuiLink
                    component={Link}
                    to="/"
                    sx={{
                        color: '#0078D4',
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Quay lại trang chủ
                </MuiLink>
            </ContentContainer>
        </PageContainer>
    )
}

export default Page403