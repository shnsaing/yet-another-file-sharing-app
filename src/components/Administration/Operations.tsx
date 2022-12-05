import React, { FC, useReducer, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { WithTranslation } from 'react-i18next';

import TableView from '../TableView';
import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withTranslation from '../../hoc/withTranslation';
import { ModalAction } from '../../services/auth/auth';
import { OperationAction as Action } from '../../services/auth/auth';
import type User from '../../types/User';

import '../../style.less';

interface OperationType extends User {
  key: React.Key;
}

const OperationsPage: FC<
  WithTranslation & WithDataManagerProps & { inTab?: boolean }
> = ({ dataManager, t, inTab }) => {
  const getOperations = async () => {
    const ops = await dataManager.getOperations();
    return ops.map((op, i) => {
      return Object.assign(op, { key: i });
    });
  };

  const {
    data: operations,
    isFetching,
    refetch,
  } = useQuery(['operations'], getOperations, {
    onError: (e) => {
      console.error(e);
    },
    refetchOnWindowFocus: false,
  });

  const [modalFormData, setModalFormData] = useState<any | null>(null);

  const handleFormValues = (changedValues: any, allValues: any) => {
    setModalFormData(allValues);
  };

  const modalReducer = (prevState: any, action: any) => {
    switch (action.type) {
      case Action.CREATE_OPERATION:
        return {
          action: Action.CREATE_OPERATION,
          content: null,
          showModal: true,
        };
      case Action.MODIFY_OPERATION:
        return {
          action: Action.MODIFY_OPERATION,
          content: null,
          showModal: true,
        };
      case Action.DELETE_OPERATION:
        return {
          action: Action.DELETE_OPERATION,
          showModal: true,
        };
      case ModalAction.CLOSE_MODAL:
      default:
        setModalFormData(null);
        return {
          content: null,
          showModal: false,
        };
    }
  };

  const [modalState, modalDispatch] = useReducer(modalReducer, {
    content: null,
    showModal: false,
  });

  const columns: ColumnsType<OperationType> = [];

  const hideModal = () => {
    modalDispatch({
      type: ModalAction.CLOSE_MODAL,
    });
  };

  const modalOnOk = async () => {
    if (modalState.action && modalFormData) {
      switch (modalState.action) {
        case Action.CREATE_OPERATION:
          refetch();
          break;
        case Action.MODIFY_OPERATION:
          refetch();
          break;
        case Action.DELETE_OPERATION:
          refetch();
          break;
      }
    }
    hideModal();
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          onClick={() => {
            modalDispatch({
              type: Action.CREATE_OPERATION,
            });
          }}
        >
          {t('operation.new')}
        </div>
      ),
      key: 'new_op',
    },
  ];

  return (
    <TableView
      data={operations}
      isFetching={isFetching}
      actionsItems={items}
      columns={columns}
      formData={modalFormData}
      setFormData={setModalFormData}
      modalOnOkHandler={modalOnOk}
      hideModalHandler={hideModal}
      showModal={modalState.showModal}
      modalContent={modalState.content}
      minusTabSize={inTab}
    />
  );
};

export default withTranslation(withDataManager(OperationsPage));
