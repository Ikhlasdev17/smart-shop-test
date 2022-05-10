import React, { useState, useEffect } from "react";

import "./Profile.scss";

import { useTranslation } from "react-i18next";
import axios from "axios";
import Dragger from "antd/lib/upload/Dragger";
import { Button, Form, Input, message } from "antd";
import { setToken, URL } from "../../assets/api/URL";
import swal from "sweetalert";

import CopyToClipboard from "react-copy-to-clipboard";

const Profile = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));
  const pincode = localStorage.getItem("pincode");
  const password = localStorage.getItem("password");
  const [photoUploaded, setPhotoUploaded] = useState("default");
  const [newUser, setUser] = useState({
    employee_id: user.id,
    avatar: user.avatar,
    name: user.name,
    phone: user.phone,
    password: password,
    pincode: null,
    role: user.role,
  });

  const [copied, setCopied] = useState(false);

  const generatePincode = () => {
    axios.get(`${URL}/api/pincode/generate`, setToken()).then((res) => {
      setUser({ ...newUser, pincode: res.data.payload.pincode });
    });
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  const photoUploader = (e) => {
    setPhotoUploaded("loading");

    const formData = new FormData();
    formData.append("file", e.file.originFileObj);
    formData.append("upload_preset", "smart-shop");

    axios
      .post(
        "https://api.cloudinary.com/v1_1/http-electro-life-texnopos-site/image/upload",
        formData
      )
      .then((res) => {
        setUser((prev) => ({ ...newUser, avatar: res.data.secure_url }));
        setPhotoUploaded("ok");
      });
  };

  const updateUserData = async () => {
    if (newUser.name !== "" && newUser.phone !== "" && newUser.password !== "") {
      const res = await axios.patch(
        `${URL}/api/employee/update`,
        newUser,
        setToken()
      ); 
      if (res.status === 200) {
        swal({
          title: t("muaffaqiyatli"),
          icon: "success",
        });
        setPhotoUploaded("default");
      }
    } else {
      message.warn(t("malumotni_toliq_kiriting"))
    }
  };

  return (
    <div className="section">
      <h1 className="heading">{t("profile")}</h1>
      <div className="content">
        <div className="content-top"></div>

        <Form layout="vertical">
          <div className="profile__update">
            <div className="profile__info">
              <Form.Item label={t("fio")}>
                <Input
                  className="form__input"
                  placeholder={t("fio")}
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label={t("telefon_raqami")}>
                <Input
                  className="form__input"
                  placeholder={t("telefon_raqami")}
                  type="text"
                  value={newUser.phone}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label={t("parol")}>
                <Input.Password
                  inputMode="password"
                  className="form__input"
                  placeholder={t("parol")}
                  type="text"
                  value={newUser.password}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label={t("pinkod")} required>
                <div className="form-group">
                  <div className="form-group__item">
                    <CopyToClipboard
                      text={newUser.pincode}
                      onCopy={() => setCopied(true)}
                    >
                      <div
                        className={
                          copied ? "pincode__field copied" : "pincode__field"
                        }
                      >

                        {newUser.pincode !== null ? (!copied ? newUser.pincode : t("copied")) : "XXXXX"}
                      </div>
                    </CopyToClipboard>
                  </div>
                  <div className="form-group__min-item">
                    <Button
                      className="btn btn-primary"
                      onClick={(e) => generatePincode()}
                    >
                      {t("yangilash")}
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </div>
            <div className="profile__settings">
              <Dragger
                className="photo__uploader"
                onChange={photoUploader}
                showUploadList={false}
              >
                {photoUploaded === "default" ? (
                  <>
                    <i className="bx bx-cloud-upload ant-upload-drag-icon"></i>
                    <h4>{t("rasm_yuklang")}</h4>
                    <p>{t("rasimni_tanlash_text")}</p>
                  </>
                ) : photoUploaded === "ok" ? (
                  <>
                    <i className="bx bx-check-circle success-icon"></i>
                    <h4>{t("muaffaqiyatli")}</h4>
                  </>
                ) : (
                  photoUploaded === "loading" && (
                    <>
                      <i className="bx bx-time-five ant-upload-drag-icon"></i>
                      <h4>{t("kuting")}</h4>
                    </>
                  )
                )}
              </Dragger>
              <br />
              <Button
                style={{ width: "100%" }}
                className="btn btn-primary"
                onClick={(e) => {
                  setUser({...newUser, avatar: null}) 
                  message.success(t("muaffaqiyatli"))
                  setPhotoUploaded("default")
                }}
                disabled={newUser.avatar === null}
              >
                {t("remove__image")}
              </Button>
              <br />

              <Button
                style={{ width: "100%" }}
                className="btn btn-primary"
                onClick={updateUserData}
              >
                {t("save")}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
