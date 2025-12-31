import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomButton } from '../../components/common/BottomButton';
import SelectUserTypeComponent from '../../components/login/SelectUserTypeComponent';
import { postRole } from '../../api/auth-controller';

type UserType = 'GUARDIAN' | 'SENIOR' | null;

const SelectUserType = () => {
  const navigation = useNavigation();
  const [hasSelectedUserType, setHasSelectedUserType] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);

  const createRole = async () => {
    if (!selectedUserType) return;
    await postRole(selectedUserType);
    navigation.navigate('FirstFontSetting');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <Title>사용자 유형 선택</Title>
        <SelectUserTypeComponent
          onSelectionChange={(hasSelection, type) => {
            setHasSelectedUserType(hasSelection);
            setSelectedUserType(type);
          }}
        />
        <BottomButton
          text="확인"
          disabled={!hasSelectedUserType}
          onPress={createRole}
        />
      </Container>
    </SafeAreaView>
  );
};
export default SelectUserType;

const Container = styled.View`
  flex: 1;
  margin: 100px 20px 0px 20px;
`;

const Title = styled.Text`
  font-size: 30px;
  text-align: center;
  margin-bottom: 120px;
`;
