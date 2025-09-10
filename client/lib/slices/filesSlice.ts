import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FileData {
  id: string;
  name: string;
  type: string;
  url: string;
  status: string;
  rejectionReason?: string;
  uploadedAt: string;
  [key: string]: any;
}

export interface FilesState {
  files: Record<string, FileData>;
  isLoading: boolean;
  isFilesLoaded: boolean;
  error: string | null;
}

const initialState: FilesState = {
  files: {},
  isLoading: false,
  isFilesLoaded: false,
  error: null,
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFiles(
      state: FilesState,
      action: PayloadAction<Record<string, FileData>>
    ) {
      state.files = action.payload;
      state.error = null;
    },
    addFile(state: FilesState, action: PayloadAction<FileData>) {
      const file = action.payload;
      state.files[file.id] = file;
      state.error = null;
    },
    updateFile(
      state: FilesState,
      action: PayloadAction<{ id: string; updates: Partial<FileData> }>
    ) {
      const { id, updates } = action.payload;
      if (state.files[id]) {
        state.files[id] = { ...state.files[id], ...updates };
      }
    },
    removeFile(state: FilesState, action: PayloadAction<string>) {
      const fileId = action.payload;
      delete state.files[fileId];
    },
    clearFiles(state: FilesState) {
      state.files = {};
      state.error = null;
    },
    updateFileStatus(
      state: FilesState,
      action: PayloadAction<{
        fileId: string;
        status: string;
        rejectionReason?: string;
      }>
    ) {
      const { fileId, status, rejectionReason } = action.payload;
      if (state.files[fileId]) {
        state.files[fileId] = {
          ...state.files[fileId],
          status,
          rejectionReason,
        };
      }
    },
    setLoading(state: FilesState, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state: FilesState, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setFilesLoaded(state: FilesState, action: PayloadAction<boolean>) {
      state.isFilesLoaded = action.payload;
    },
  },
});

export const {
  setFiles,
  addFile,
  updateFile,
  removeFile,
  clearFiles,
  updateFileStatus,
  setLoading,
  setError,
  setFilesLoaded,
} = filesSlice.actions;

export default filesSlice.reducer;
