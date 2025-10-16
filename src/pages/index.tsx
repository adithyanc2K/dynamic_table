import { Provider } from 'react-redux';
import { store } from '../store/store';
import DynamicTable from '../components/DynamicTable';

export default function Home() {
  return (
    <Provider store={store}>
      <div style={{ padding: '20px' }}>
        <h1>Dynamic Data Table Manager</h1>
        <DynamicTable />
      </div>
    </Provider>
  );
}
