import { SafeAreaView } from 'react-native-safe-area-context';
import Description from '../../assets/login/description.svg';
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components';

const Manual = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout>
        <ScrollContent></ScrollContent>
      </Layout>
    </SafeAreaView>
  );
};

export default Manual;

const Layout = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.root.backgroundColor};
`;

const ScrollContent = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 80,
  },
}))``;
