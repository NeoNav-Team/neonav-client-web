import AppView from '@/components/appView';
import CashApp from '@/components/cashApp';
import PageContainer from '../components/pageContainer'

export default function Bank() {
 return (
    <PageContainer>
        <AppView>
            <CashApp/>
        </AppView>
    </PageContainer>
);
}
