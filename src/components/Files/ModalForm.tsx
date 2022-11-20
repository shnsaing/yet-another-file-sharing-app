import React from 'react';
import { Form, Input } from 'antd';
import { WithTranslation } from 'react-i18next';

import withTranslation from '../../hoc/withTranslation';

import './ModalForm.less';

type Input = {
  name: string;
  value?: string;
};

interface ModalFormProps extends WithTranslation {
  inputs: Input[];
  onFormValueChange: (changedValues: any, allValues: any) => void;
}

const ModalForm = ({ t, inputs, onFormValueChange }: ModalFormProps) => {
  const [form] = Form.useForm();

  return (
    <Form
      className="modal-form"
      preserve={false}
      onValuesChange={onFormValueChange}
    >
      {inputs.map((input, index) => {
        return (
          <Form.Item
            key={index}
            name={input.name}
            rules={[{ required: true }]}
            initialValue={input.value}
          >
            <Input placeholder={t(`form.${input.name}`)} />
          </Form.Item>
        );
      })}
    </Form>
  );
};

export default withTranslation(ModalForm);
