import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { setToken, URL } from "../../../assets/api/URL";

const Content = ({ ingredients, product_id, onClose, open }) => {
  const { t } = useTranslation();
  const [optionsCount, setOptionsCount] = React.useState(0);
  const [selectedItems, setSelectedItems] = React.useState([]);
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
  // SET INGREDIENT STATE
  React.useEffect(() => {
    setSelectedItems([]);
    setOptionsCount(0);
  }, [open]);

  // onChange Select
  const onChangeSelect = (value) => {
    setSelectedItems([
      ...selectedItems,
      {
        ingredient_id: value,
        count: 0,
      },
    ]);
    if (
      ingredients.filter((x) => {
        return !selectedItems.find((y) => y.ingredient_id === x.id);
      }).length !== 0
    ) {
      setOptionsCount(optionsCount + 1);
    }
  };

  // onSubmit Form
  const onSubmit = (e) => {
    if (selectedItems.length > 0) {
      setLoading(true);
      axios
        .post(
          `${URL}/api/ingredient/product`,
          {
            product_id,
            ingredients: selectedItems,
          },
          setToken()
        )
        .finally(() => setLoading(false))
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: t("muaffaqiyatli"),
              icon: "success",
              confirmButtonText: t("OK"),
            });
            onClose(false);
          }
        })
        .catch((err) => {
          Swal.fire({
            title: t("xatolik"),
            icon: "error",
            confirmButtonText: t("OK"),
          });
        });
    }
  }; 
  console.info(selectedItems)
  // MAIN RENDER
  return (
    <div>
      <Form>
        {Array.from(Array(optionsCount).keys()).map((i) => (
          <Form.Item className="form__item">
            <div className="form-group">
              <Input
                readOnly
                value={
                  ingredients.find(
                    (x) => x.id === selectedItems[i]?.ingredient_id
                  )?.name
                }
                className="form__input"
              />
              <InputNumber
                value={selectedItems[i]?.count}
                prefix={
                  unit_id_options.find(
                    (x) => x.id === ingredients[i]?.unit_id
                  )?.label
                }
                color="red"
                className="form__input"
                onChange={(e) => {
                  setSelectedItems([
                    ...selectedItems.slice(0, i),
                    {
                      ...selectedItems[i],
                      count: e,
                    },
                    ...selectedItems.slice(i + 1),
                  ]);
                }}
              />
              <button
                className="btn btn-primary"
                style={{ padding: "5px", marginTop: "5px", cursor: "pointer" }}
                onClick={() => {
                  setSelectedItems([
                    ...selectedItems.slice(0, i),
                    ...selectedItems.slice(i + 1),
                  ]);
                  setOptionsCount(optionsCount - 1);
                }}
              >
                <i className="bx bx-trash"></i>
              </button>
            </div>
          </Form.Item>
        ))}

        {ingredients.filter((x) => {
          return !selectedItems.find((y) => y.ingredient_id === x.id);
        }).length > 0 && (
          <Form.Item>
            <Select
              onChange={onChangeSelect}
              className="form__input"
              placeholder={t("ingredient")}
            >
              {ingredients
                .filter((x) => {
                  return !selectedItems.find((y) => y.ingredient_id === x.id);
                })
                .map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button
            className="btn btn-primary"
            htmlType="submit"
            loading={loading}
            onClick={onSubmit}
            disabled={selectedItems.length === 0}
          >
            {t("save")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Content;
