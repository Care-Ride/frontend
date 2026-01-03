import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';

import BackButton from '../../components/common/BackButton';
import DestinationSearchBar from '../../components/drivingAction/DestinationSearchBar';
import DestinationItem, {
  Destination,
} from '../../components/drivingAction/DestinationItem';
import { getDriveDestination } from '../../api/driving-controller';

const SearchDestination = () => {
  const navigation = useNavigation<any>();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Destination[]>([]);

  const handleSearch = async () => {
    const q = keyword.trim();
    if (!q) return;

    try {
      const res = await getDriveDestination(q);
      if (!res) return;

      const rawList = res.data?.data.places ?? [];

      const list: Destination[] = rawList.map((item: any, index: number) => ({
        id: item.id ?? index,
        name: item.name ?? item.placeName ?? '이름 없음',
        address: item.address ?? item.roadAddress ?? '',
        lat: item.lat ?? '',
        lon: item.lon ?? '',
      }));

      setResults(list);
    } catch (e) {
      console.log('목적지 검색 실패:', e);
    }
  };

  const handleSelect = (item: Destination) => {
    console.log('선택한 목적지:', item);
    navigation.navigate(
      'ReadyDriving' as never,
      { destination: item.name, lat: item.lat, lon: item.lon } as never,
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />

      <Container>
        <DestinationSearchBar
          value={keyword}
          onChangeText={setKeyword}
          onSubmit={handleSearch}
        />

        <FlatList
          data={results}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <DestinationItem item={item} onSelect={handleSelect} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
        />
      </Container>
    </SafeAreaView>
  );
};

export default SearchDestination;

const Container = styled.View`
  flex: 1;
  margin: 0 20px;
  padding-top: 8px;
`;
