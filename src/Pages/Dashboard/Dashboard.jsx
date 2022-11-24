import {
  Table,
  Col,
  Button,
  Modal,
  Row,
  Typography,
  Form,
  Input,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../../Layouts/index";
import { deleteRequest, getRequest, putRequest } from "../../api";
import { useNavigate, useLocation } from "react-router-dom";
import { postRequest } from "../../api";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Title } = Typography;

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editID, setEditID] = useState(null);
  const [editData, setEditData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Physics",
      dataIndex: "physics",
    },
    {
      title: "Chemistry",
      dataIndex: "chemistry",
    },
    {
      title: "Maths",
      dataIndex: "maths",
    },
    {
      title: "Percentage",
      dataIndex: "Percentage",
      render: (_, record) => {
        return (
          (parseInt(record.physics) +
            parseInt(record.chemistry) +
            parseInt(record.maths)) /
          3
        ).toFixed(2);
      },
    },
    {
      title: "image",
      dataIndex: "image",
      render: (_, record) => (
        <div>
          <Typography.Link
            style={{
              marginRight: 8,
            }}
            target="_blank"
            href={process.env.REACT_APP_URL + record.image}
          >
            <img
              width="auto"
              height="60"
              src={process.env.REACT_APP_URL + record.image}
            />
          </Typography.Link>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <span>
            <Typography.Link
              onClick={() => editFormData(record?._id)}
              style={{
                marginRight: 8,
              }}
            >
              <EditOutlined />
            </Typography.Link>
            <Typography.Link
              onClick={async () => {
                await deleteRequest(`student/delete/${record._id}`).then(
                  ({ data }) => {
                    setStudents((students) => {
                      return students.filter(
                        (student) => student._id != record._id
                      );
                    });
                    navigate(redirectPath, { replace: true });
                  }
                );
              }}
            >
              <DeleteOutlined />
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const onChange = async (pagination, filters, sorter, extra) => {
    await getRequest(`students?page=${pagination.current}`).then(({ data }) => {
      setStudents(data[0].data);
      setPage(data[0].metadata[0].page);
      setTotal(data[0].metadata[0].total);
    });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setEditID(null);
    setEditData(null);
    setIsModalOpen(true);
  };

  const editFormData = (value) => {
    setIsModalOpen(true);
    setEditID(value);
    setEditData(students?.find((c) => c._id === value));
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const redirectPath = location.state?.path || "/dashboard";
  const onFinish = async (values) => {
    setIsSubmit(true);
    const studentData = new FormData();
    studentData.append("name", values?.name || "");
    studentData.append("physics", values?.physics || "");
    studentData.append("chemistry", values?.chemistry || "");
    studentData.append("maths", values?.maths || "");
    studentData.append("image", values?.image?.file?.originFileObj);
    editID
      ? await putRequest(`student/edit/${editID}`, studentData)
          .then(({ data }) => {
            setIsModalOpen(false);
            setStudents((students) =>
              students.map((student) => {
                if (student._id === editID) {
                  return data?.student;
                } else {
                  return student;
                }
              })
            );
            navigate(redirectPath, { replace: true });
            setIsSubmit(false);
          })
          .catch((err) => {
            setIsSubmit(false);
          })
      : await postRequest(`student/add`, studentData)
          .then(({ data }) => {
            setIsModalOpen(false);
            setStudents((students) => [...students, data?.student]);
            navigate(redirectPath, { replace: true });
            setIsSubmit(false);
          })
          .catch((err) => {
            setIsSubmit(false);
          });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const defaultFunction = async () => {
    await getRequest(`students?page=${page}`).then(({ data }) => {
      setStudents(data[0]?.data);
      setPage(data[0]?.metadata[0]?.page);
      setTotal(data[0]?.metadata[0]?.total);
    });
  };

  useEffect(() => {
    defaultFunction();
  }, []);

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  return (
    <>
      <Layout>
        <Row style={{ marginTop: "2em" }} justify="center">
          <Col xs={24} sm={24} md={22} lg={20} xl={20}>
            <Row
              style={{ marginBottom: "2em" }}
              justify="space-between"
              align="center"
            >
              <Col>
                <Title level={2}>Students</Title>
              </Col>

              <Col style={{ display: "flex", alignItems: "center" }}>
                <Button className="button" onClick={showModal}>
                  Add Student
                </Button>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={students}
              onChange={onChange}
              pagination={{
                total: total,
                current: page,
                pageSize: 10,
              }}
              scroll={{ x: true }}
            />
          </Col>
        </Row>
      </Layout>
      <Modal
        title="Basic Modal"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          name="basic"
          initialValues={{
            name: editData?.name,
            physics: editData?.physics,
            chemistry: editData?.chemistry || undefined,
            maths: editData?.maths,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="cd_form"
          validateMessages={validateMessages}
        >
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
          >
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter name!",
                  },
                ]}
              >
                <Input
                  className="inputfield"
                  style={{ padding: "10px" }}
                  placeholder="Enter Name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="physics"
                rules={[
                  {
                    required: true,
                    message: "Please enter physics!",
                  },
                ]}
              >
                <Input
                  type="number"
                  className="inputfield"
                  style={{ padding: "10px" }}
                  placeholder="Enter Physics"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="chemistry"
                rules={[
                  {
                    required: true,
                    message: "Please enter chemistry!",
                  },
                ]}
              >
                <Input
                  type="number"
                  className="inputfield"
                  style={{ padding: "10px" }}
                  placeholder="Enter Chemistry"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="maths"
                rules={[
                  {
                    required: true,
                    message: "Please enter maths!",
                  },
                ]}
              >
                <Input
                  type="number"
                  className="inputfield"
                  style={{ padding: "10px" }}
                  placeholder="Enter Maths"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="image"
                rules={[
                  {
                    required: !editID ? true : false,
                    message: "Please Upload Image!",
                  },
                ]}
              >
                <Upload
                  name="image"
                  action="/upload.do"
                  listType="picture"
                  style={{ padding: "10px", width: "100%" }}
                  customRequest={dummyRequest}
                  accept=".png,.jpg,.jpeg"
                >
                  <Button>Upload Image</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button className="button" htmlType="submit" loading={isSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Dashboard;
