import 'antd/dist/antd.css'
import 'moment/locale/ru'

import { ConfigProvider, Layout, Menu } from 'antd'

import { CreateTicket } from '../components/CreateTicket'
import Holiday from '../models/Holiday'
import { NextPage } from 'next'
import Service from '../models/Service'
import User from '../models/User'
import { holidayApi } from '../api/holiday'
import moment from 'moment'
import { nonWorkDaysApi } from '../api/nonWorkDays'
import ru_RU from 'antd/lib/locale-provider/ru_RU'
import { serviceApi } from '../api/service'
import { userApi } from '../api/user'

const { Header, Content, Footer } = Layout

interface Props {
	services: Service[]
	client: User
	master: User
	holidays: Holiday[]
	nonWorkDays: number[]
}

moment.locale('ru')
const Home: NextPage<Props> = ({ services, client, master, holidays, nonWorkDays }) => (
	<ConfigProvider locale={ru_RU}>
		<Layout>
			<Header>
				<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
					<Menu.Item key="1">Запись</Menu.Item>
				</Menu>
			</Header>
			<Content style={{ padding: '0 20px' }}>
				<CreateTicket
					services={services}
					client={client}
					master={master}
					holidays={holidays}
					nonWorkDays={nonWorkDays}
				/>
			</Content>
			<Footer />
		</Layout>
	</ConfigProvider>
)

Home.getInitialProps = async function() {
	const master: User = {
		id: 1,
	}
	const services = await serviceApi.list(master.id)
	const client = await userApi.get(1)
	const holidays = await holidayApi.list(master.id)
	const nonWorkDays = await nonWorkDaysApi.list()

	return {
		services,
		client,
		master,
		holidays,
		nonWorkDays,
	}
}

export default Home
