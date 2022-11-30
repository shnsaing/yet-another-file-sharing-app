import React from 'react';
import { Form, Input, Select } from 'antd';
import { WithTranslation } from 'react-i18next';

import withTranslation from '../../hoc/withTranslation';

import './ModalForm.less';

type Input = {
  name: string;
  value?: string;
  possibleValues?: string[];
  values?: string[];
};

interface ModalFormProps extends WithTranslation {
  inputs: Input[];
  onFormValueChange: (changedValues: any, allValues: any) => void;
}

const { Option } = Select;

const ModalForm = ({ t, inputs, onFormValueChange }: ModalFormProps) => {
  const [form] = Form.useForm();

  const validateMessages = {
    required: t('form.invalidInput'),
    types: {
      email: t('email.invalidMessage'),
    },
  };

  return (
    <Form
      className="modal-form"
      preserve={false}
      onValuesChange={onFormValueChange}
      validateMessages={validateMessages}
    >
      {inputs.map((input, index) => {
        let component;
        let rules: any = {};
        if (input.possibleValues) {
          component = (
            <Select
              placeholder={t(`form.${input.name}`)}
              mode="multiple"
              defaultValue={input.values}
              allowClear
            >
              {input.possibleValues.map((value, key) => {
                return (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          );
        } else if (input.name === 'password') {
          component = <Input.Password placeholder={t('password')} />;
        } else if (input.name === 'email') {
          component = <Input placeholder={t('email.label')} />;
          rules.type = 'email';
        } else {
          component = <Input placeholder={t(`form.${input.name}`)} />;
        }
        return (
          <Form.Item
            key={index}
            name={input.name}
            rules={[{ required: true, ...rules }]}
            initialValue={input.value}
          >
            {component}
          </Form.Item>
        );
      })}
    </Form>
  );
};

export default withTranslation(ModalForm);
