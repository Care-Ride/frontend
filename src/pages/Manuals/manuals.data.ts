import { ManualDoc } from '../../types/manual.types';

//SENIOR-운전하기 안내 매뉴얼
import Driving1 from '../../assets/manuals/driving/driving1.svg';
import Driving2 from '../../assets/manuals/driving/driving2.svg';
import Driving3 from '../../assets/manuals/driving/driving3.svg';
import Driving4 from '../../assets/manuals/driving/driving4.svg';
import Driving5 from '../../assets/manuals/driving/driving5.svg';
import Driving6 from '../../assets/manuals/driving/driving6.svg';
import Driving7 from '../../assets/manuals/driving/driving7.svg';

//SENIOR-보호자 연동하기 안내 매뉴얼
import Guardian1 from '../../assets/manuals/guardian_link/guardian_link1.svg';
import Guardian2 from '../../assets/manuals/guardian_link/guardian_link2.svg';
import Guardian3 from '../../assets/manuals/guardian_link/guardian_link3.svg';

//SENIOR-포인트 얻기 안내 매뉴얼
import PointsEarn1 from '../../assets/manuals/points_earn/points_earn1.svg';
import PointsEarn2 from '../../assets/manuals/points_earn/points_earn2.svg';
import PointsEarn3 from '../../assets/manuals/points_earn/points_earn3.svg';

//SENIOR-포인트 사용하기 안내 매뉴얼
import PointsUse1 from '../../assets/manuals/points_use/points_use1.svg';
import PointsUse2 from '../../assets/manuals/points_use/points_use2.svg';
import PointsUse3 from '../../assets/manuals/points_use/points_use3.svg';
import PointsUse4 from '../../assets/manuals/points_use/points_use4.svg';

//GUARDIAN-운전자 연동하기 안내 매뉴얼
import DriverLink1 from '../../assets/manuals/driver_link/driver_link1.svg';
import DriverLink2 from '../../assets/manuals/driver_link/driver_link2.svg';
import DriverLink3 from '../../assets/manuals/driver_link/driver_link3.svg';
import DriverLink4 from '../../assets/manuals/driver_link/driver_link4.svg';

//GUARDIAN-운전자 운전내역 확인 안내 매뉴얼
import DriverRecordCheck1 from '../../assets/manuals/driver_record_check/driver_record_check1.svg';
import DriverRecordCheck2 from '../../assets/manuals/driver_record_check/driver_record_check2.svg';
import DriverRecordCheck3 from '../../assets/manuals/driver_record_check/driver_record_check3.svg';
import DriverRecordCheck4 from '../../assets/manuals/driver_record_check/driver_record_check4.svg';
import DriverRecordCheck5 from '../../assets/manuals/driver_record_check/driver_record_check5.svg';

export const MANUALS: ManualDoc[] = [
  {
    id: 'driving',
    title: '운전하기 안내',
    pages: [
      {
        Image: Driving1,
        description: '목적지를 입력한다',
      },
      {
        Image: Driving2,
        description: '목적지를 선택한다',
      },
      {
        Image: Driving3,
        description: '운전 전 위험을 확인하고\n운전하기를 누른다',
      },
      {
        Image: Driving4,
        description: '운전 전 운전 점검을 하고\n다음을 누른다',
      },
      {
        Image: Driving5,
        description:
          '운전 중 운전 위험 알림이 음성 제공되며, 운전이 끝나면 운전 종료하기를 누른다',
      },
      {
        Image: Driving6,
        description: '운전이 종료되면 \n운전 리포트를 확인한다',
      },
      {
        Image: Driving7,
        description: '운전이 종료되면 \n운전 리포트를 확인한다',
      },
    ],
  },
  {
    id: 'guardianLink',
    title: '보호자 연동하기 안내',
    pages: [
      {
        Image: Guardian1,
        description: '설정창에서 “운전자 연동 관리”\n에 들어간다',
      },
      {
        Image: Guardian2,
        description: '보호자 연동 관리에서 \n“보호자 연동하기”를 누른다',
      },
      {
        Image: Guardian3,
        description: '화면에 표시된 5자리 숫자 \n코드를 보호자에게 전달한다',
      },
    ],
  },
  {
    id: 'pointsEarn',
    title: '포인트 얻기 안내',
    pages: [
      {
        Image: PointsEarn1,
        description: '미션 참여하기 탭에서 \n미션을 확인한다',
      },
      {
        Image: PointsEarn2,
        description: '각 미션에서 상세버튼을 눌러 \n미션 설명을 확인한다',
      },
      {
        Image: PointsEarn3,
        description:
          '미션 조건을 달성하면 자동으로 \n해당 미션 포인트가 지급된다',
      },
    ],
  },
  {
    id: 'pointsUse',
    title: '포인트 사용 안내',
    pages: [
      {
        Image: PointsUse1,
        description: '포인트 탭에서 \n사용하기 버튼을 누른다',
      },
      {
        Image: PointsUse2,
        description:
          '잔여 포인트를 확인하고 구매할 \n상품의 구매하기 버튼을 누른다',
      },
      {
        Image: PointsUse3,
        description: '구매 완료 후 포인트 탭의 \n선물함에 들어간다',
      },
      {
        Image: PointsUse4,
        description: '구매한 상품의 \n바코드를 확인한다',
      },
    ],
  },
  {
    id: 'driverLink',
    title: '운전자 연동하기 안내',
    pages: [
      {
        Image: DriverLink1,
        description: '설정창에서 “보호자 연동 \n관리”에 들어간다',
      },
      {
        Image: DriverLink2,
        description: '운전자 연동 관리에서 \n“운전자 연동하기”를 누른다',
      },
      {
        Image: DriverLink3,
        description: '운전자의 화면에 표시된 \n5자리 숫자 코드를 전달받는다',
      },
      {
        Image: DriverLink4,
        description:
          '전달받은 5자리 숫자코드를 인증하고 관계와 보호자의 성명을 입력한다',
      },
    ],
  },
  {
    id: 'driverRecordCheck',
    title: '운전자 운전내역 확인 안내',
    pages: [
      {
        Image: DriverRecordCheck1,
        description:
          '운전자 운전내역을 확인하려면 \n운전자 연동하기를 완료한다',
      },
      {
        Image: DriverRecordCheck2,
        description: '운전 기록 탭을 누른다',
      },
      {
        Image: DriverRecordCheck3,
        description: '연동된 운전자의 일별,\n월별 운전 기록을 확인한다',
      },
      {
        Image: DriverRecordCheck4,
        description: '연동된 운전자의\n일별 운전 기록을 확인한다',
      },
      {
        Image: DriverRecordCheck5,
        description: '연동된 운전자의\n월별 운전 기록을 확인한다',
      },
    ],
  },
];

export const getManualById = (id: string) => MANUALS.find(m => m.id === id);
