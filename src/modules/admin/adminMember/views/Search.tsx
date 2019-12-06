import {DGender, DStatus, ListSearch} from 'entity/member';
import {Input, Select} from 'antd';
import {createForm, filterEmpty, getFormDecorators} from 'common/utils';

import {FormComponentProps} from 'antd/lib/form';
import RangeDatePicker from 'components/RangeDatePicker';
import React from 'react';
import ResourceSelector from 'components/ResourceSelector';
import SearchForm from 'components/SearchForm';
import {connect} from 'react-redux';

const RoleSelector = loadView('adminRole', 'Selector');

const Option = Select.Option;

interface StoreProps {
  listSearch?: ListSearch;
}

class Component extends React.PureComponent<StoreProps & FormComponentProps & DispatchProp> {
  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.form.validateFields((errors, values: ListSearch) => {
      if (!errors) {
        this.props.dispatch(actions.adminMember.searchList(filterEmpty(values), 'current'));
      }
    });
  };
  private onReset = () => {
    this.props.dispatch(actions.adminMember.searchList({}, 'default'));
  };
  public render() {
    const {form, listSearch = {}} = this.props;
    const formDecorators = getFormDecorators<ListSearch>(form);
    const items = [
      {label: '用户名', item: formDecorators.username(<Input autoComplete="off" allowClear={true} placeholder="请输入用户名" />)},
      {label: '呢称', item: formDecorators.nickname(<Input autoComplete="off" allowClear={true} placeholder="请输入呢称" />)},
      {
        label: '状态',
        item: formDecorators.status!(
          <Select allowClear={true} placeholder="请选择用户状态">
            {DStatus.options.map(option => (
              <Option key={option.key} value={option.key}>
                {option.name}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        label: '角色',
        item: formDecorators.roleId!(<ResourceSelector title="请选择角色" placeholder="请选择角色" resourceNameField="roleName" limit={3} allowClear={true} resource={RoleSelector} />),
      },
      {
        label: '性别',
        item: formDecorators.gender!(
          <Select allowClear={true} placeholder="请选择性别">
            {DGender.options.map(option => (
              <Option key={option.key} value={option.key}>
                {option.name}
              </Option>
            ))}
          </Select>
        ),
      },
      {label: '注册时间', item: formDecorators.createdTime!(<RangeDatePicker />)},
      {label: '登录时间', item: formDecorators.loginTime!(<RangeDatePicker />)},
    ];
    return (
      <div className="g-search">
        <SearchForm expand={!!listSearch.gender || !!listSearch.createdTime || !!listSearch.loginTime} onReset={this.onReset} onSubmit={this.onSubmit} senior={4} items={items}></SearchForm>
      </div>
    );
  }
}

const mapStateToProps: (state: RootState) => StoreProps = state => {
  return {listSearch: state.adminMember!.preRouteParams?.listSearch};
};
const mapPropsToFields = (props: StoreProps) => {
  return {
    ...props.listSearch,
  };
};
export default connect(mapStateToProps)(createForm(Component, mapPropsToFields));
