import { ContentLayout } from '@cloudscape-design/components'
import LoginRequired from './LoginRequired'

export default function LoginPage({ redirectTo }: {redirectTo: string}) {
    return (
        <ContentLayout>
            <LoginRequired />
        </ContentLayout>
    )
}