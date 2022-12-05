import React from 'react';
import { Form, Modal } from 'antd';
import type { WithTranslation } from 'react-i18next';

import withTranslation from '../../hoc/withTranslation';

interface CustomModalProps extends WithTranslation {
  showModal: boolean;
  onOk: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

const CustomModal = ({
  t,
  showModal,
  onOk,
  onCancel,
  children,
}: CustomModalProps) => {
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

export default withTranslation(CustomModal);
