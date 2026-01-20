import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import Taxi from '../../assets/alternativeTransportation/taxi.svg';
import Driver from '../../assets/alternativeTransportation/driver.svg';
import { postMobilityCall } from '../../api/mobility-controller';
import Geolocation from 'react-native-geolocation-service';

import { SimpleInfoModal } from '../../components/common/Modal';
import TaxiRound from '../../assets/common/taxi.svg';
import DriverRound from '../../assets/common/driver.svg';
import { Linking } from 'react-native';

type MobilityType = 'TAXI' | 'SUBSTITUTE';

const SelectTransportationComponent = () => {
  const [isTaxiModalVisible, setIsTaxiModalVisible] = useState(false);
  const [isSubstituteModalVisible, setIsSubstituteModalVisible] =
    useState(false);

  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const [phoneNumber, setPhoneNumber] = useState('');

  const fetchCurrentLocation = useCallback((): Promise<{
    lat: number;
    lon: number;
  }> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        pos => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        err => reject(err),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  }, []);

  //대체 이동수단 부르기 API 연결
  const readMobilityCall = useCallback(
    async (mobilityType: MobilityType) => {
      try {
        let curLat = lat;
        let curLon = lon;

        if (curLat == null || curLon == null) {
          const loc = await fetchCurrentLocation();
          curLat = loc.lat;
          curLon = loc.lon;
          setLat(loc.lat);
          setLon(loc.lon);
        }
        console.log(curLat, curLon, 'lat');

        const response = await postMobilityCall(curLat, curLon, mobilityType);

        const raw = response?.data?.data;

        const nextPhone =
          typeof raw === 'string'
            ? raw
            : typeof raw === 'number'
            ? String(raw)
            : typeof raw?.phoneNumber === 'string'
            ? raw.phoneNumber
            : '';

        setPhoneNumber(nextPhone);
        return nextPhone;
      } catch (err) {
        console.error(err);
      }
    },
    [lat, lon, fetchCurrentLocation],
  );

  useEffect(() => {
    fetchCurrentLocation()
      .then(loc => {
        setLat(loc.lat);
        setLon(loc.lon);
      })
      .catch(err => console.error(err));
  }, [fetchCurrentLocation]);

  const openTaxiModal = async () => {
    try {
      const nextPhone = await readMobilityCall('TAXI');
      if (!nextPhone) return;
      setIsTaxiModalVisible(true);
    } catch (err) {
      console.error(err);
    }
  };

  const openSubstituteModal = async () => {
    try {
      const nextPhone = await readMobilityCall('SUBSTITUTE');
      if (!nextPhone) return;
      setIsSubstituteModalVisible(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setIsTaxiModalVisible(false);
    setIsSubstituteModalVisible(false);
  };

  const handleConfirm = async () => {
    setIsTaxiModalVisible(false);
    setIsSubstituteModalVisible(false);

    if (!phoneNumber) return;

    const call = phoneNumber.replace(/[^\d+]/g, '');
    const url = `tel:${call}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
  };
  return (
    <SelectButtonContainer>
      <SelectButton
        onPress={openSubstituteModal}
        accessibilityLabel="대리운전 선택 버튼"
      >
        <Driver />
        <ButtonText>대리운전</ButtonText>
      </SelectButton>

      <SelectButton
        onPress={openTaxiModal}
        accessibilityLabel="콜택시 선택 버튼"
      >
        <Taxi />
        <ButtonText>콜택시</ButtonText>
      </SelectButton>

      <SimpleInfoModal
        visible={isSubstituteModalVisible}
        badgeIcon={<DriverRound />}
        title="대리운전 연동"
        body="대리운전 기사님을 부르기 위해 전국 대리운전 번호로 연동합니다. 전화번호가 입력된 창이 열리면 그대로 전화를 걸어주세요."
        confirmText="확인"
        onConfirm={handleConfirm}
        onRequestClose={handleClose}
      />
      <SimpleInfoModal
        visible={isTaxiModalVisible}
        badgeIcon={<TaxiRound />}
        title="콜택시 연동"
        body="전국 어디서나 이용 가능한 콜택시 번호로 연결합니다. 전화번호가 입력된 창이 열리면 그대로 전화를 걸어주세요."
        confirmText="확인"
        onConfirm={handleConfirm}
        onRequestClose={handleClose}
      />
    </SelectButtonContainer>
  );
};

export default SelectTransportationComponent;

const SelectButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 13px;
  margin-bottom: 24px;
`;

const SelectButton = styled.TouchableOpacity`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bluePrimary};
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  margin: 15px 0;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  margin-top: 8px;
`;
