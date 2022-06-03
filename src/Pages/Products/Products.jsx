import {
  Select,
  DatePicker,
  Table,
  Button,
  Input,
  Drawer,
  Skeleton,
  Pagination,
  Modal,
} from "antd";
import React, { useState, useEffect } from "react";

import axios from "axios";
import {
  fetchingProducts,
  fetchedProducts,
  deleteProduct,
} from "../../redux/productsSlice";

import "./Products.scss";
import { useDispatch, useSelector } from "react-redux";

import { setToken, URL } from "../../assets/api/URL";
import {
  fetchedCategories,
  fetchingCategories,
  fetchingErrorCategories,
} from "../../redux/categoriesSlice";
import Content from "./Content";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { DebounceInput } from "react-debounce-input";
import TableResponsive from "../../components/TableResponsive/TableResponsive";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Products = () => {
  const dispatch = useDispatch();
  const { products, productsFetchingStatus } = useSelector(
    (state) => state.productsReducer
  );
  const { categories, categoriesFetchingStatus } = useSelector(
    (state) => state.categoriesReducer
  );
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentProduct, setCurrentProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [qrCode, setQrCode] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [lastPage, setLastPage] = useState();
  const [perPage, setPerPage] = useState();

  const [USD, setUSD] = useState("");
  const [currency, setCurrency] = useState([]);

  const [productDetailsIsOpen, setProductDetailsIsOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  const [exporting, setExporting] = useState(false);

  useEffect(async () => {
    dispatch(fetchingCategories());
    setLoading(true);
    const res = await axios
      .get(`${URL}/api/categories`, setToken())
      .then((res) => {
        dispatch(fetchedCategories(res.data.payload));
      });
  }, []);

  const unit_id_options = [
    { id: 1, label: t("dona") },
    { id: 2, label: t("tonna") },
    { id: 3, label: t("kilogram") },
    { id: 4, label: t("gramm") },
    { id: 5, label: t("meter") },
    { id: 6, label: t("sm") },
    { id: 7, label: t("liter") },
  ];

  const deleteProductFunc = (id) => {
    Swal.fire({
      title: t("delete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: t("deleted"),
          icon: "success",
        });
        dispatch(fetchingProducts());
        axios.delete(`${URL}/api/product/${id}`, setToken()).then((res) => {
          dispatch(deleteProduct(id));
          setRefresh(!refresh);
        });
      }
    });
  };




  const dataSource = [];
  products.length > 0 &&
    products?.map((item) => {
      const currentCategory =
        categories &&
        categories.length > 0 &&
        categories[
          categories?.findIndex((cate) => cate?.id === item?.category.id)
        ];
      dataSource.push({
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
        category: currentCategory?.name,
        brand: item?.brand,
        cost_price: (
          <span>
            <strong>{item?.cost_price?.price !== null && item?.cost_price?.price.toLocaleString()}</strong>{" "}
            {item?.cost_price?.code}
          </span>
        ),
        whole_price: (
          <span>
            <strong>{item?.whole_price?.price}</strong>{" "}
            {item?.whole_price?.code}
          </span>
        ),
        max_price: (
          <span>
            <strong>{item?.max_price?.price !== null && item?.max_price?.price.toLocaleString()}</strong>{" "}
            {item?.max_price?.code}
          </span>
        ),
        min_price: (
          <span>
            <strong>{item?.min_price?.price !== null && item?.min_price?.price.toLocaleString()}</strong>{" "}
            {item?.min_price?.code}
          </span>
        ),
        warehouse: (
          <span className="table-text-group">
            <strong>{item?.warehouse !== null ? item?.warehouse?.count : 0} </strong>{" "}
            <p>
              {item?.warehouse !== null ? unit_id_options?.filter(
                (x) => x.id === item?.warehouse?.unit?.id
              )[0]?.label || "" : '0'}
            </p>
          </span>
        ),
        actions: (
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
            <Button className="" onClick={() => deleteProductFunc(item?.id)}>
              <i className="bx bx-trash"></i>
            </Button>
          </div>
        ),
      });
    });


  const exportData = () => {
    setExporting(true);
    fetch(`${URL}/api/products/export`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Disposition": "attachment; filename=products.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        setExporting(false);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "products.xlsx");

        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
      });
  };

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
      title: t("brend"),
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: t("cost_price"),
      dataIndex: "cost_price",
      key: "cost_price",
    },
    {
      title: t("whole_price"),
      dataIndex: "whole_price",
      key: "whole_price",
    },
    {
      title: t("min_price"),
      dataIndex: "min_price",
      key: "min_price",
    },
    {
      title: t("max_price"),
      dataIndex: "max_price",
      key: "max_price",
    },
    {
      title: t("hozir_bor"),
      dataIndex: "warehouse",
      key: "warehouse",
    },
    {
      title: t("action"),
      dataIndex: "actions",
      key: "actions",
    },
  ];

  useEffect(async () => {
    dispatch(fetchingProducts());

    const response = await axios.get(
      `${URL}/api/products?search=${search}${ search === "" && category === "" ? `&page=${page}` : '' }&category_id=${category}`,
      setToken()
    );
    setLoading(true);

    if (response.status === 200) {
      dispatch(fetchedProducts(response.data.payload.data));
      setLoading(false);
      setLastPage(response.data.payload.last_page);
      setPerPage(response.data.payload.per_page);
    }
  }, [open, search, page, category, refresh]);

  useEffect(async () => {
    const res2 = await axios.get(`${URL}/api/currency`, setToken());

    if (res2.status === 200) {
      setCurrency(res2.data.payload);
      setUSD(res2.data.payload[1].rate[0].rate);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setProductDetailsIsOpen(false);
    }

  }, [open]);

  return (
    <div className="section products-page">
      <Drawer
        title={
          modalType === "add"
            ? t("mahsulot_qoshish")
            : modalType === "update"
            ? t("mahsulotni_tahrirlash")
            : modalType === "import"
            ? t("import_product")
            : t("product_qr")
        }
        visible={open}
        onClose={() => setOpen(false)}
      >
        <Content
          open={open}
          refresh={refresh}
          setRefresh={() => setRefresh()}
          qr_code_link={qrCode}
          currency_date={currency}
          USD_RATE={USD}
          type={modalType}
          currentProduct={currentProduct}
          setOpen={() => setOpen()}
        />
      </Drawer>
      {!open && productDetailsIsOpen ? (
        <Modal
          footer={null}
          visible={productDetailsIsOpen}
          onCancel={() => {
            setProductDetailsIsOpen(false);
            setProductDetails({});
          }}
        >
          <h2>{productDetails?.name}</h2>
          <table className="product__details-table">
            <tbody className="product__details-table__body">
              <tr>
                <td>{t("categories")}</td>
                <td>
                  {categories &&
                    categories.length > 0 &&
                    categories[
                      categories?.findIndex(
                        (cate) => cate?.id === productDetails?.category.id
                      )
                    ].name}
                </td>
              </tr>
              <tr>
                <td>{t("cost_price")}</td>
                <td>
                  {productDetails?.cost_price.price !== null && productDetails?.cost_price.price.toLocaleString()}{" "}
                  {productDetails?.cost_price.code}
                </td>
              </tr>
              <tr>
                <td>{t("whole_price")}</td>
                <td>
                  {productDetails?.whole_price.price !== null && productDetails?.whole_price.price.toLocaleString()}{" "}
                  {productDetails?.whole_price.code}
                </td>
              </tr>
              <tr>
                <td>{t("min_price")}</td>
                <td>
                  {productDetails?.min_price.price !== null && productDetails?.min_price.price.toLocaleString()}{" "}
                  {productDetails?.min_price.code}
                </td>
              </tr>

              <tr>
                <td>{t("max_price")}</td>
                <td>
                  {productDetails?.max_price.price !== null && productDetails?.max_price.price.toLocaleString()}{" "}
                  {productDetails?.max_price.code}
                </td>
              </tr>
            </tbody>
          </table>

          <br />

          <div className="product__detail-image">
            {productDetails?.image !== null && (
              <img src={productDetails?.image} alt="product" />
            )}
          </div>
        </Modal>
      ) : null}

      <h1 className="heading">{t("products")}</h1>

      <div className="content">
        <div className="content-top">
          <Select
            className="form__input content-select content-top__input"
            showSearch
            placeholder={t("categories")}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(e) => setCategory(e)}
            value={category}
          >
            <Option value={""}>{t("barcha_mahsulotlar")}</Option>
            {categories.map((category) => {
              return (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              );
            })}
          </Select>

          <DebounceInput
            debounceTimeout={800}
            minLength={2}
            placeholder={t("search")}
            onChange={(e) => setSearch(e.target.value)}
            className="form__input"
          />

          <Button
            className="btn btn-primary btn-md"
            onClick={() => {
              setModalType("import");
              setOpen(true);
            }}
          >
            <i className="bx bx-download"></i> {t("import")}
          </Button>

          <Button
            className="btn btn-primary btn-md"
            onClick={() => {
              exportData();
            }}
            loading={exporting}
          >
            <i className="bx bx-upload"></i> {t("export")}
          </Button>
          <Button
            className="btn btn-primary btn-md"
            onClick={() => {
              setOpen(true);
              setModalType("add");
            }}
          >
            <i className="bx bx-plus"></i> {t("mahsulot_qoshish")}
          </Button>
        </div>

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
              rowClassName={"table-row"}
              className="content-table lg-table"
              width="100%"
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />

            <div className="responsive__table">
              {products &&
                products.length > 0 &&
                products.map((item, index) => {
                  return (
                    <div
                      className="responsive__table-item"
                      key={index}
                      onClick={(e) => {
                        !(e.target.classList.value.includes("bx")) && 
                          setProductDetailsIsOpen(true); 
                          setProductDetails(item);
                      }}
                    >
                      <div className="responsive__table-item__details-name">
                        <h3>{item?.name}</h3>
                        <h4>{item?.brand}</h4>
                        <h4>
                          {item?.cost_price.price}{" "}
                          {item?.cost_price.code === "USD" ? "$" : "UZS"}
                        </h4>
                      </div>
                      <div>
                        <div className="responsive__table-item__details-count">
                          <h3>
                            <i className="bx bx-package"></i>
                          </h3>
                          <h4>{item?.warehouse.count}</h4>
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
                                deleteProductFunc(item?.id)
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
            </div>
          </Skeleton>

          {lastPage > 1 && (
            <div className="pagination__bottom">
              <Pagination
                total={lastPage * perPage}
                pageSize={perPage ? perPage : 0}
                current={page}
                onChange={(c) => setPage(c)}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
