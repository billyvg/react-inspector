/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from 'react';

export type ExpandedPaths = Record<string, boolean>;

export type ExpandedPathsContextType = [ExpandedPaths, Dispatch<SetStateAction<ExpandedPaths>>];
export const ExpandedPathsContext = createContext<ExpandedPathsContextType>([{}, () => {}]);
