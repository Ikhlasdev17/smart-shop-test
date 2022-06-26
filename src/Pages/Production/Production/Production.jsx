import { Button, Collapse, DatePicker, InputNumber, message, Modal, Pagination, Select, Skeleton, Table, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { setToken, URL } from "../../../assets/api/URL";
import { DebounceInput } from "react-debounce-input";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Swal from "sweetalert2";
import moment from "moment";

const Production = () => {
  // STATE CONFIGURATIONS
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [category_id, setCategory_id] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [last_page, setLastPage] = useState("");
  const [per_page, setPerPage] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [responseModal, setResponseModal] = useState(false);
  const [deadLine, setDeadLine] = useState('')

  // UNIT ITEMS
  const unit_id_options = [
    { id: 1, label: t("dona") },
    { id: 2, label: t("tonna") },
    { id: 3, label: t("kilogram") },
    { id: 4, label: t("gramm") },
    { id: 5, label: t("meter") },
    { id: 6, label: t("sm") },
    { id: 7, label: t("liter") },
  ];

  // FETCHING CATEGORIES
  useEffect(() => {
    async function fetchingCategories() {
      const res = await axios.get(`${URL}/api/categories`, setToken());
      if (res.status === 200) {
        setCategories(res.data.payload);
      }
    }

    fetchingCategories();
  }, []);

  // FETCHING PRODUCTS
  useEffect(async () => {
    setLoading(true);

    const response = await axios.get(
      `${URL}/api/products/ingredient?page=${page}&search=${search}&category_id=${category_id}`,
      setToken()
    );
    setLoading(true);

    if (response.status === 200) {
      setProducts(response.data.payload.data);
      setLoading(false);
      setLastPage(response.data.payload.last_page);
      setPerPage(response.data.payload.per_page);
    }
  }, [category_id, search]);

  // UPDATE PRODUCTS
  const handleChangeCount = (value, product) => {
    const index = selectedItems?.findIndex(item => item?.product_id === product?.id);
    const newArr = [...selectedItems];
    newArr[index].count = value
    setSelectedItems(newArr);
  };

  // DELETE FROM SELECTED
  const deleteFromSelected = (id) => {
    const newArr = selectedItems.filter(item => item.product_id !== id);
    setSelectedItems(newArr)
    const newResponseData = responseData.filter(item => item.product_id !== id)
    setResponseData(newResponseData)
    const newSelectedRowKeys = selectedRowKeys.filter(item => item !== id)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  // SELECTING PRODUCTS
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  console.info(products)

  // SET SELECTED ITEMS
  useEffect(() => {
    let newSelectedArray = [];
    selectedRowKeys?.map((item) => {
      newSelectedArray.push({
        product_id: item,
        count: 1,
      });
    });
    setSelectedItems(newSelectedArray);
  }, [selectedRowKeys]);

  // SEND PRODUCTS TO ORDER
  const handleSend = async () => {
    setLoading(true)

    const res = await axios.post(`${URL}/api/production`, selectedItems, setToken()).finally(err => setLoading(false))
    .catch(err => {
        Swal.fire({
            title: 'Kechirasiz bu mahsulotni qoshib bolmaydi',
            icon: 'info'
        })
    })

    if (res.status === 200) {
        setResponseData(res.data)
        setLoading(false) 
        setResponseModal(true)
    }

  }; 

  // SEND TO ORDER (FINAL)
  const sendToOrder = async () => {
    if (deadLine !== '') {
      setLoading(true)
    const res = await axios.post(`${URL}/api/production/create`, {
      deadline: deadLine,
      products: selectedItems
    },
    setToken()).catch(() => {
      Swal.fire({
        title: t('faqat_ishlab_chiqarish_mumkin'),
        icon: 'error'
      })
    })
    .finally(() => setLoading(false))

    if (res.status === 200) {
      Swal.fire({
        title: t('muaffaqiyatli'),
        icon: 'success'
      })
      setLoading(false)
      setResponseModal(false)
      setSelectedItems([])
      setSelectedRowKeys([])
      setDeadLine('')
    }
    } else {
      Swal.fire({
        title: t('malumotni_toliq_kiriting'),
        icon: 'warn'
      })
    }
  }

  // TABLE DATA
  const dataSource = [];
  products?.map((item, index) => {
    dataSource?.push({
      key: item?.id,
      product: (
        <div className="product__table-product">
          <div className="product__table-product__image">
            <Zoom>
              <img
                src={
                  item?.image !== null
                    ? item?.image
                    : "https://seafood.vasep.com.vn/no-image.png"
                }
                alt="Product Photo"
              />
            </Zoom>
          </div>
          <div className="product__tabel-product_name">
            <h3>{item?.name}</h3>
          </div>
        </div>
      ),
      category: categories?.find((e) => e.id === item?.category?.id)?.name || '',
      production_count: (
        <InputNumber
          className="form__input table_input"
          placeholder={t("count")}
          onChange={e => handleChangeCount(e, item)}
          disabled={selectedRowKeys.findIndex(e => e === item?.id) === -1}
          value={selectedItems?.find(x => x?.product_id === item?.id) !== undefined ? selectedItems?.find(x => x?.product_id === item?.id).count : null}
        />
      ),
    });
  });

  // TABLE HEADERS
  const columns = [
    {
      title: t("products"),
      dataIndex: "product",
      key: "key",
    },
    {
      title: t("categories"),
      dataIndex: "category",
      key: "category",
    },
    {
      title: t("ishlab_chiqarish_soni"),
      dataIndex: "production_count",
      key: "production_count",
    },
  ];


  console.info(responseData)
  

  // getTotalSum
  const getTotalSum = (arr) => {
    let ourPrice = []
    arr?.map(item => {
      ourPrice.push(item?.price * item?.count)
    })

    let totalSum = ourPrice.reduce((prev, current) => prev + current, 0)

    return totalSum.toLocaleString()
  }


  // get total ingredient count price
  const getIngredientCountPrice = (item) => {
    return (item?.count * item?.price).toLocaleString()
  }
  console.info(responseData)
  // MAIN RETURN
  return (
    <div className="section main-page">
      <h1 className="heading">{t("order")}</h1>
      <div className="content">
        <Modal
            width={780}
            visible={responseModal} 
            footer={
              <>
                <Button onClick={() => {
                  setResponseModal(false)
                  setResponseData([])
                }}>
                  {t('cancel')}
                </Button>
                <Button type="primary" onClick={sendToOrder}
                >
                  {t('save')}
                </Button>
              </>
            }
            title={t('ishlab_chiqarish')}
            onCancel={() => {
              setResponseModal(false)
              setResponseData([])
            }}
          >
            <DatePicker 
              onChange={(e) => setDeadLine(e)}
              style={{margin: '0 0 20px 0', width: '100%'}}
              value={deadLine}
            />
            <br />
            <div className="h-500 overlfow-y-auto">
             

          <Collapse className="calculator-info">
              {
                responseData?.map((item, index) => (
                  <Collapse.Panel header={<div className="calculator-info__header">
                    <td className="info-table__th">
                      <b className="capitalize">{products?.find(x =>x?.id === item?.product_id)?.category?.name}</b> {" "}{" "}{" "}
                    </td>
                    <td className="info-table__th">
                      <b className="capitalize">{item?.product_name}</b> {" "}{" "}{" "}
                    </td>
                    <td className="info-table__th">
                    {
                        item?.ingredients?.findIndex(x => x.status === 'not enough') !== -1 ? (
                          <Tag color={'error'}>
                            {t('islep_shigariw_mumkin_emes')}
                          </Tag>
                        ) : ( 
                          <Tag color={'success'}>
                            {t('islep_shigariw_mumkin')}
                          </Tag>
                        )
                      }
                    </td>
                      <td className="info-table__th">
                      <b>{t('price')}: </b>
                      <span>{
                        getTotalSum(item?.ingredients)
                      }</span>{" "}
                      </td>
                    <td className="info-table__th">
                      <b>{t('count')} </b><span>{item?.count}</span>
                      <Button type="link" danger
                        onClick={() =>{
                          deleteFromSelected(item?.product_id)
                          Swal.fire({
                            title: t('deleted'),
                            icon: 'success'
                          })
                        }}
                      >
                        <i className="bx bx-trash"></i>
                      </Button>
                    </td>
                  </div>} key={index}>
                  {
                      item?.ingredients?.map(ingredient => (
                        <tr className="info-table__row">
                          <td className="info-table__td">
                            {ingredient?.ingredient_name}
                          </td> 
                          <td className="info-table__td">
                            {ingredient?.count}
                            {ingredient?.unit_id}
                          </td>
                          <td className="info-table__td">
                            <b>{t('price')}:</b> {getIngredientCountPrice(ingredient)}
                          </td>
                          {
                            ingredient?.ordered_at !== null ? (
                              <td className="info-table__td">
                                {moment(ingredient?.ordered_at).format('DD MMM, YYYY')}
                              </td>
                            ) : (
                              <td className="info-table__td"></td>
                            )
                          }
                          <td className="info-table__td">
                          <Tag color={ingredient?.status === "enough" ? 'success' : 'error'}>
                            {
                              ingredient?.status === "enough" ? t('yetarli') : t('yetmaydi')
                            }
                          </Tag>
                          </td>
                          
                        </tr>
                      ))
                    }
                  </Collapse.Panel>
                ))
              } 
            </Collapse>
            </div>
        </Modal>
        <div className="content-top">
          <div className="content-top__group">
            <Select
              className="form__input content-select content-top__input wdith_3"
              showSearch
              placeholder="Kategoriyalar"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(e) => setCategory_id(e)}
              value={category_id}
            >
              <Select.Option value={""}>
                {t("barcha_mahsulotlar")}
              </Select.Option>
              {categories.map((category) => {
                return (
                  <Select.Option value={category.id}>
                    {category.name}
                  </Select.Option>
                );
              })}
            </Select>

            <DebounceInput
              minLength={2}
              debounceTimeout={800}
              placeholder={t("search")}
              onChange={(e) => setSearch(e.target.value)}
              className="form__input wdith_3"
            />
          </div>

          <div className="content-top__group">
            <Button
                className="btn btn-primary"
                onClick={handleSend}
                loading={loading}
                disabled={selectedItems.length === 0}
            >
                {t('save')}
            </Button>
          </div>
        </div>
        {/* MAIN CONTENT BODY TABLE */}
        <div className="content-body">
          <Skeleton
            loading={loading}
            active
            avatar
            rows={15}
            width="100%"
            block
          >
            <Table
              size="small"
              className="content-table"
              width="100%"
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              rowSelection={rowSelection}
            />

            {/* <div className="responsive__table">
              {products &&
                products.length > 0 &&
                products.map((item, index) => {
                  return (
                    <div
                      className="responsive__table-item"
                      key={index}
                      onClick={(e) => {
                        // !e.target.classList.value.includes("bx") &&
                        //   setProductDetailsIsOpen(true);
                        //   setProductDetails(item);
                      }}
                    >
                      <div className="responsive__table-item__details-name">
                        <h3>{item?.name}</h3>
                        <h4>{item?.brand}</h4> 
                      </div>
                      <div>
                        <div className="responsive__table-item__details-count">
                          <h3>
                            <i className="bx bx-package"></i>
                          </h3>
                          <h4>
                            {item?.warehouse?.count !== null
                              ? item?.warehouse?.count
                              : 0}
                          </h4>
                        </div>

                        <div className="responsive__table-item__details-actions">
                          <div className="table-button__group">
                            <Button
                              onClick={(e) => {
                                setOpen(!open);
                                setModalType("print");
                                setQrCode(item?.qr_code_link);
                              }}
                              className=""
                            >
                              <i className="bx bx-printer"></i>
                            </Button>
                            <Button
                              className=""
                              onClick={() => {
                                setOpen(!open);
                                setModalType("update");
                                setCurrentProduct(item);
                              }}
                            >
                              <i className="bx bx-edit"></i>
                            </Button>
                            <Button
                              className=""
                              onClick={() => {
                                deleteProductFunc(item?.id);
                              }}
                            >
                              <i className="bx bx-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div> */}
          </Skeleton>

          {last_page > 1 && (
            <div className="pagination__bottom">
              <Pagination
                total={last_page * per_page}
                pageSize={per_page ? per_page : 0}
                current={page}
                onChange={(c) => {
                  setPage(c);
                }}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Production;
