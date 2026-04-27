import { atom, useAtom } from 'jotai';

export type ModuleName = 'rendez-vous' | 'tournee';
export type ModalAction =
  | 'add'
  | 'edit'
  | 'delete'
  | 'view'
  | 'valider'
  | 'refuser'
  | 'proposer-date';

export interface ModalState<T = unknown> {
  isOpen: boolean;
  module: ModuleName | null;
  action: ModalAction | null;
  data: T | null;
}

const modalAtom = atom<ModalState>({
  isOpen: false,
  module: null,
  action: null,
  data: null,
});

export function useModalStore<T = unknown>() {
  const [state, setState] = useAtom(modalAtom);

  return {
    ...state,
    data: state.data as T | null,
    openModal: (
      module: ModuleName,
      action: ModalAction,
      data: T | null = null
    ) => setState({ isOpen: true, module, action, data }),
    closeModal: () => setState((prev) => ({ ...prev, isOpen: false })),
  };
}
