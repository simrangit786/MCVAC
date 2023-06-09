import React, {useState} from 'react';
import {Select, Space, Spin, Typography} from 'antd';
import {Image as Images} from "../Images"
import {debounceEvent} from '../../Controller/utils';

const _ = require('lodash')
const {Option} = Select;


const LoadMoreDropdown = (props) => {
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    // console.log(props.tierSet,"props.fieldName");

    // useEffect(() => {
    //     if (page === 1) {
    //         handleData({isSearched: true, ...props.kwargs})
    //     } else {
    //         handleData(props.kwargs);
    //     }
    // }, [page, search])


    const handleData = (params) => {
        setLoading(true)
        props.apiCall({search, ...params, page: page, ...props.initial})
            .then(res => {
                if(props.tierSet){
                    // console.log(res.data.results);
                    props.tierSet(res.data.results)
                }
                setItems(res.data.results)
                setCount(res.data.count)
                setLoading(false)
            })

    }
    

    const handleLoadMore = () => {
        setLoading(true)
        props.apiCall({search, page: page + 1, ...props.initial})
            .then(res => {
                setItems([...items, ...res.data.results])
                setCount(res.data.count)
                setLoading(false)
            })
        setPage(page + 1)
    }

    const handleButton = (e) => {
        setSearch(e);
        setPage(1)
        handleData({...props.kwargs, search: e})
    }
    const handleChange = (value) => {
        props.setLoadMoreValue(value)
    }

    return (
        <Select
            disabled = {props.disabled}
            onFocus={() => handleData(props.kwargs)}
            onChange={handleChange}
            style={{width: '100%'}}
            showSearch={true}
            labelInValue
            notFoundContent={
                loading ? <Spin size="small"/> : null
            }
            filterOption={false}
            placeholder={"Select"}
            onSearch={debounceEvent(handleButton, 300)}
            suffixIcon={<img alt={''} className="img-fluid"
                             src={Images.caret_small_icon_select}/>
            }
            dropdownRender={menu => (
                <>
                    {menu}
                    {items.length !== count &&
                    <Space className='w-100 d-flex align-items-center justify-content-center' align="center"
                           style={{padding: "5px 10px", borderTop: '1px solid #f2f2f2'}}>
                        <Typography.Link onClick={handleLoadMore} style={{whiteSpace: 'nowrap'}}>
                            Load More
                        </Typography.Link>

                    </Space>
                    }
                </>
            )}
        >
            {items.map((item, index) => (
                <Option key={item.id} value={_.get(item, props.value)}>{_.get(item, props.label)}</Option>
            ))}
        </Select>
    );
};

export default LoadMoreDropdown;