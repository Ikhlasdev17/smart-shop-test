import { Button, Table } from "antd";
import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import { setToken, URL } from "../../../assets/api/URL";

const ProductIngredients = ({ id, onClose, open }) => {
  const [ingredients, setIngredients] = React.useState([]);
  const { t } = useTranslation();
  const [refresh, setRefresh] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
  // FETCHING INGREDIENTS
  React.useEffect(async () => {
    const response = await axios.get(
      `${URL}/api/ingredient/product/${id}`,
      setToken()
    );
    if (response.status === 200) {
      setIngredients(response.data.payload);
    }
  }, [id, refresh, open]);

  // DELETE INGREDIENT
  const deleteIngredient = async (id) => {
    setLoading(true);
    const response = await axios
      .delete(`${URL}/api/ingredient/product/position/${id}`, setToken())
      .finally(() => {
        onClose(false);
        setLoading(false);
      });
    if (response.status === 200) {
      onClose(true);
      setRefresh(!refresh);
    }
  };

  // TABLE DATA
  const dataSource = [];
  ingredients?.map((item) => {
    dataSource.push({
      key: item?.position_id,
      ingredient: item?.ingredient?.name,
      count: (
        <div className="product__table-count flex">
          <b>{item?.count}</b>{" "}
          <span>
            {
              unit_id_options?.find((x) => x.id === item?.ingredient?.unit_id)
                .label
            }
          </span>
        </div>
      ),
      delete: (
        <div className="table-button__group">
          <Button
            disabled={loading}
            className="table-btn"
            onClick={() => deleteIngredient(item.position_id)}
          >
            <i className="bx bx-trash"></i>
          </Button>
        </div>
      ),
    });
  });

  // TABLE HEADER
  const columns = [
    {
      title: t("ingredient"),
      dataIndex: "ingredient",
      key: "ingredient",
    },
    {
      title: t("count"),
      dataIndex: "count",
      key: "count",
    },
    {
      title: t("action"),
      dataIndex: "delete",
      key: "delete",
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default ProductIngredients;
