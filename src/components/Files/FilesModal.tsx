import React from 'react';
import { Form, Modal } from 'antd';
import { WithTranslation } from 'react-i18next';

import withTranslation from '../../hoc/withTranslation';

type Input = {
  name: string;
};

interface FilesModalProps extends WithTranslation {
  showModal: boolean;
  onOk: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

const FilesModal = ({
  t,
  showModal,
  onOk,
  onCancel,
  children,
}: FilesModalProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      centered
      open={showModal}
      onOk={onOk}
      okText="Ok"
      onCancel={onCancel}
      cancelText={t('modal.close')}
      bodyStyle={{ display: 'flex', justifyContent: 'center' }}
      destroyOnClose
    >
      {children}
    </Modal>
  );
};

export default withTranslation(FilesModal);
