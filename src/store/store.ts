import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RowData {
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: any;
}

interface TableState {
  rows: RowData[];
  columns: { key: string; label: string; visible: boolean }[];
}

const initialState: TableState = {
  rows: [
     { name: 'Alice', email: 'alice@mail.com', age: 25, role: 'Developer' },
    { name: 'Bob', email: 'bob@mail.com', age: 30, role: 'Designer' },
    { name: 'Charlie', email: 'charlie@mail.com', age: 28, role: 'Manager' },
  ],
  columns: [
    { key: 'name', label: 'Name', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'age', label: 'Age', visible: true },
    { key: 'role', label: 'Role', visible: true },
  ],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<RowData[]>) {
      state.rows = action.payload;
    },
    addColumn(state, action: PayloadAction<{ key: string; label: string }>) {
      state.columns.push({ ...action.payload, visible: true });
    },
    toggleColumn(state, action: PayloadAction<string>) {
      const col = state.columns.find(c => c.key === action.payload);
      if (col) col.visible = !col.visible;
    },
  },
});

export const { setRows, addColumn, toggleColumn } = tableSlice.actions;

export const store = configureStore({
  reducer: { table: tableSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
