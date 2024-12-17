import React, { useMemo, useState } from "react";
import {
  ActionButton,
  Flex,
  NumberField,
  TextField,
  Text,
  Accordion,
  Disclosure,
  DisclosureTitle,
  DisclosurePanel,
} from "@adobe/react-spectrum";
import "./App.scss";

import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import Flag from "@spectrum-icons/workflow/Flag";
import { sampleData } from "./data";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import Comment from "@spectrum-icons/workflow/Comment";
import Add from "@spectrum-icons/workflow/Add";

const days = ["m", "tu", "w", "th", "f", "sa", "su"];

const App = () => {
  const [addingCount, setAddingCount] = useState(1);
  const [expandedPanel, setExpandedPanel] = useState([]);

  const [expandedRows, setExpandedRows] = useState([]);
  const [tableData, setTableData] = useState(sampleData);

  const { sumsData, daySum, totalSum, wage, totalWage } = useMemo(() => {
    const sums = [];
    let daySum = {};
    let totalSum = 0;
    const wage = [];
    let totalWage = 0;

    tableData.forEach((parent) => {
      parent.rows.forEach((row, rowIndex) => {
        const rowSum = {};
        const rowWage = {};
        const values = row.values;
        Object.keys(values).forEach((valueKey) => {
          const crrSum = days.reduce((result, dayKey) => {
            const crrValue = values[valueKey][dayKey];
            daySum = {
              ...daySum,
              [dayKey]: (daySum[dayKey] || 0) + Number(crrValue),
            };
            totalSum += Number(crrValue);
            return result + Number(crrValue);
          }, 0);
          rowSum[valueKey] = crrSum;
          const crrWage = crrSum * row["Rate (Hourly)"];
          rowWage[valueKey] = crrWage;
          totalWage += crrWage;
        });
        sums.push(rowSum);
        wage.push(rowWage);
      });
    });
    return { sumsData: sums, daySum, totalSum, wage, totalWage };
  }, [tableData]);

  const handleInputChange = (
    type,
    valueIndex,
    value,
    parentIndex,
    rowIndex
  ) => {
    setTableData((prevData) =>
      prevData.map((item, index) =>
        index === parentIndex
          ? {
              ...item,
              rows: item.rows.map((child, childIndex) =>
                childIndex === rowIndex
                  ? {
                      ...child,
                      values: {
                        ...child.values,
                        [type]: {
                          ...child.values[type],
                          [valueIndex]: value,
                        },
                      },
                    }
                  : child
              ),
            }
          : item
      )
    );
  };
  const toggleRow = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const handleParentPanelExpand = (index) => {
    setExpandedPanel((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="table-container">
      <table className="top-table">
        <thead className="top-header">
          <tr>
            <th></th>
            <th></th>
            <th style={{ textAlign: "center" }}>
              <Text
                UNSAFE_style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "18px",
                  color: "#464646",
                  visibility: "hidden",
                }}
              >
                Rate
              </Text>
            </th>
            <th>
              <Flex
                direction="row"
                gap="size-100"
              >
                {days.map((day, dayIndex) => (
                  <div
                    className="week-title-value"
                    key={day}
                  >
                    <span className="bold">{day}</span>
                    {`${15 + dayIndex}th`}
                  </div>
                ))}
              </Flex>
            </th>
            <th>TIME</th>
            <th>WAGES</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <React.Fragment key={index}>
              <tr
                className="accordion-title"
                style={{
                  background: expandedPanel.includes(index)
                    ? "#F0FDFB"
                    : "white",
                }}
              >
                <td className="accordion-title-first">
                  <Flex
                    direction="row"
                    alignItems="center"
                    justifyContent="start"
                  >
                    <ActionButton
                      isQuiet
                      onPress={() => handleParentPanelExpand(index)}
                      aria-label="left"
                    >
                      {expandedPanel.includes(index) ? (
                        <ChevronDown />
                      ) : (
                        <ChevronRight />
                      )}
                    </ActionButton>
                    <Flex
                      direction="column"
                      UNSAFE_style={{ paddingLeft: "10px" }}
                    >
                      <Text
                        UNSAFE_style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#909090",
                        }}
                      >
                        {data["Union Local"]}
                      </Text>
                      <Flex
                        direction="row"
                        gap="size-100"
                      >
                        <Text
                          UNSAFE_style={{
                            fontSize: "16px",
                            lineHeight: "24px",
                            fontWeight: 600,
                          }}
                        >
                          {data["Employee Name"]}
                        </Text>
                        <Text
                          UNSAFE_style={{
                            fontSize: "16px",
                            lineHeight: "24px",
                            fontWeight: 600,
                            color: "#6D6D6D",
                          }}
                        >
                          ({data["Employee ID"]})
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </td>
                <td>
                  <Flex
                    direction="row"
                    alignItems="center"
                    UNSAFE_style={{ paddingRight: "5px" }}
                  >
                    <ActionButton
                      isQuiet
                      aria-label="left"
                    >
                      <Flag UNSAFE_style={{ fill: "#B1B1B1" }} />
                    </ActionButton>
                    <ActionButton
                      isQuiet
                      aria-label="left"
                    >
                      <Comment UNSAFE_style={{ fill: "#B1B1B1" }} />
                    </ActionButton>
                    <Flex
                      direction="row"
                      alignItems="center"
                      justifyContent="start"
                      UNSAFE_style={{ marginLeft: "16px" }}
                    >
                      <TextField
                        value={addingCount}
                        aria-label="number-field"
                        width="size-600"
                        onChange={(newValue) => setAddingCount(newValue)}
                        UNSAFE_className="custom-adding-count"
                      />
                      <ActionButton
                        aria-labe="icon only"
                        onPress={() => setAddingCount((prev) => prev + 1)}
                        UNSAFE_style={{
                          borderTopLeftRadius: "0px",
                          borderBottomLeftRadius: "0px",
                          borderLeft: "0px",
                        }}
                      >
                        <Add />
                      </ActionButton>
                    </Flex>
                  </Flex>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Text
                    UNSAFE_style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: "18px",
                      color: "#464646",
                      visibility: "hidden",
                    }}
                  >
                    Rate
                  </Text>
                </td>
                <td>
                  <Flex
                    direction="row"
                    gap="size-100"
                  >
                    {days.map((dayKey) => (
                      <TextField
                        aria-label="m-field"
                        key={dayKey}
                        UNSAFE_style={{
                          width: "50px",
                        }}
                        inputMode="numeric"
                        type="number"
                        isDisabled
                        value={daySum[dayKey]}
                      />
                    ))}
                  </Flex>
                </td>
                <td>
                  <TextField
                    isDisabled
                    aria-label="m-field"
                    UNSAFE_style={{ width: "50px" }}
                    value={totalSum}
                  />
                </td>
                <td>
                  <TextField
                    isDisabled
                    aria-label="m-field"
                    UNSAFE_style={{ width: "100px" }}
                    value={new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalWage)}
                  />
                </td>
              </tr>
              {expandedPanel.includes(index) && (
                <React.Fragment>
                  {data.rows &&
                    data.rows.map((row, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        <tr className="primary-row">
                          <td className="first-td">
                            <Flex
                              direction="row"
                              alignItems="start"
                            >
                              <ActionButton
                                isQuiet
                                onPress={() => toggleRow(rowIndex)}
                                aria-label="left"
                              >
                                {expandedRows.includes(rowIndex) ? (
                                  <ChevronDown />
                                ) : (
                                  <ChevronRight />
                                )}
                              </ActionButton>
                              <Flex
                                direction="column"
                                alignItems="start"
                                UNSAFE_style={{ marginRight: "16px" }}
                              >
                                <Text UNSAFE_className="job-name">
                                  {row["Job Name"]}
                                </Text>
                                <Text UNSAFE_className="job-id">
                                  {row["Job ID"]}
                                </Text>
                              </Flex>
                            </Flex>
                          </td>
                          <td>
                            <Flex
                              direction="column"
                              alignItems="start"
                            >
                              <Text UNSAFE_className="job-name">
                                {row.Classification}
                              </Text>
                              <Text UNSAFE_className="job-id">
                                {row["Agreement Name"]}
                              </Text>
                            </Flex>
                          </td>
                          {expandedRows.includes(rowIndex) ? (
                            <td style={{ textAlign: "center" }}>
                              <Text
                                UNSAFE_style={{
                                  fontSize: "12px",
                                  fontWeight: 400,
                                  lineHeight: "18px",
                                  color: "#464646",
                                }}
                              >
                                Rate
                              </Text>
                            </td>
                          ) : (
                            <td style={{ textAlign: "center" }}>
                              <Text
                                UNSAFE_style={{
                                  fontSize: "12px",
                                  fontWeight: 400,
                                  lineHeight: "18px",
                                  color: "#464646",
                                  visibility: "hidden",
                                }}
                              >
                                Rate
                              </Text>
                            </td>
                          )}
                          {expandedRows.includes(rowIndex) ? (
                            <td>
                              <Flex
                                direction="row"
                                alignItems="center"
                                justifyContent="start"
                              >
                                <TextField
                                  value={row["Rate (Hourly)"]}
                                  aria-label="hourly-rate"
                                  UNSAFE_style={{
                                    width: "81px",
                                    marginRight: "2px",
                                  }}
                                />
                                <img
                                  src="/assets/img/effect.svg"
                                  alt=""
                                  width="14px"
                                  height="14px"
                                  style={{ marginRight: "32px" }}
                                />
                                <img
                                  src="/assets/img/segmentation.svg"
                                  alt=""
                                  width="18px"
                                  height="18px"
                                  style={{ marginRight: "8px" }}
                                />
                                <Flex
                                  direction="row"
                                  alignItems="end"
                                >
                                  <Text
                                    UNSAFE_style={{
                                      fontSize: "14px",
                                      fontWeight: 600,
                                      lineHeight: "21px",
                                      fontVariant: "all-small-caps",
                                      marginRight: "2px",
                                      color: "#007772",
                                    }}
                                  >
                                    C
                                  </Text>
                                  <Text
                                    UNSAFE_style={{
                                      fontSize: "12px",
                                      fontWeight: 400,
                                      lineHeight: "18px",
                                      letterSpacing: "0.6px",
                                      marginRight: "8px",
                                    }}
                                  >
                                    $848.12
                                  </Text>
                                </Flex>
                                <Flex
                                  direction="row"
                                  alignItems="end"
                                >
                                  <Text
                                    UNSAFE_style={{
                                      fontSize: "14px",
                                      fontWeight: 600,
                                      lineHeight: "21px",
                                      fontVariant: "all-small-caps",
                                      marginRight: "2px",
                                      color: "#007772",
                                    }}
                                  >
                                    D
                                  </Text>
                                  <Text
                                    UNSAFE_style={{
                                      fontSize: "12px",
                                      fontWeight: 400,
                                      lineHeight: "18px",
                                      letterSpacing: "0.6px",
                                      marginRight: "8px",
                                    }}
                                  >
                                    ($234.21)
                                  </Text>
                                </Flex>
                                <Flex
                                  direction="row"
                                  alignItems="end"
                                >
                                  <Text
                                    UNSAFE_style={{
                                      fontSize: "14px",
                                      fontWeight: 600,
                                      lineHeight: "21px",
                                      fontVariant: "all-small-caps",
                                      marginRight: "2px",
                                      color: "#007772",
                                    }}
                                  >
                                    TIB
                                  </Text>
                                  <Text
                                    UNSAFE_style={{
                                      fontSize: "12px",
                                      fontWeight: 400,
                                      lineHeight: "18px",
                                      letterSpacing: "0.6px",
                                    }}
                                  >
                                    All
                                  </Text>
                                </Flex>
                              </Flex>
                            </td>
                          ) : (
                            <td>
                              <Flex
                                direction="row"
                                gap="size-100"
                              >
                                {days.map((dayKey) => (
                                  <TextField
                                    aria-label="m-field"
                                    key={dayKey}
                                    UNSAFE_style={{
                                      width: "50px",
                                    }}
                                    inputMode="numeric"
                                    type="number"
                                    isDisabled
                                    value={
                                      row.values.st[dayKey] +
                                      row.values.dt[dayKey] +
                                      row.values.ot[dayKey]
                                    }
                                  />
                                ))}
                              </Flex>
                            </td>
                          )}
                          {expandedRows.includes(rowIndex) ? (
                            <td>
                              <Text
                                UNSAFE_style={{
                                  fontSize: "12px",
                                  fontWeight: 400,
                                  lineHeight: "18px",
                                  color: "#464646",
                                }}
                              >
                                Expenses
                              </Text>
                            </td>
                          ) : (
                            <td>
                              <TextField
                                isDisabled
                                aria-label="m-field"
                                UNSAFE_style={{ width: "50px" }}
                                value={
                                  sumsData[rowIndex].st +
                                    sumsData[rowIndex].dt +
                                    sumsData[rowIndex].ot || ""
                                }
                              />
                            </td>
                          )}
                          {expandedRows.includes(rowIndex) ? (
                            <td>
                              <TextField
                                aria-label="row-sum"
                                UNSAFE_style={{ width: "100px" }}
                                value=""
                              />
                            </td>
                          ) : (
                            <td>
                              <TextField
                                isDisabled
                                aria-label="row-sum"
                                UNSAFE_style={{ width: "100px" }}
                                value={new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(
                                  wage[rowIndex].st +
                                    wage[rowIndex].dt +
                                    wage[rowIndex].ot
                                )}
                              />
                            </td>
                          )}
                        </tr>
                        {expandedRows.includes(rowIndex) && (
                          <React.Fragment>
                            {Object.keys(row.values).map(
                              (valueKey, valueIndex) => {
                                const crrValue = row.values[valueKey];
                                return (
                                  <tr
                                    className={`secondary-row ${
                                      valueKey === "dt" ? "final" : ""
                                    }`}
                                    key={valueIndex}
                                  >
                                    {valueIndex === 0 ? (
                                      <React.Fragment>
                                        <td
                                          style={{
                                            paddingLeft: "90px",
                                          }}
                                        >
                                          <Flex
                                            direction="row"
                                            UNSAFE_style={{
                                              borderTop: "1px solid #008C87",
                                              paddingTop: "6px",
                                            }}
                                          >
                                            <Flex direction="row">
                                              <Text UNSAFE_className="earning-code">
                                                EC
                                              </Text>
                                              <Text UNSAFE_className="earning-code-value">
                                                {row.EarningCode}
                                              </Text>
                                            </Flex>
                                          </Flex>
                                        </td>
                                        <td>
                                          <Flex
                                            direction="row"
                                            UNSAFE_style={{
                                              paddingLeft: "16px",
                                              borderLeft: "1px solid #008C87",
                                              borderTop: "1px solid #008C87",
                                              paddingTop: "6px",
                                            }}
                                          >
                                            <Text UNSAFE_className="earning-code">
                                              CC
                                            </Text>
                                            <Text UNSAFE_className="earning-code-value">
                                              {row.CostCenter}
                                            </Text>
                                          </Flex>
                                        </td>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <td />
                                        <td />
                                      </React.Fragment>
                                    )}
                                    <td style={{ textAlign: "center" }}>
                                      <Text UNSAFE_className="secondary-row-time">
                                        {valueKey.toUpperCase()}
                                      </Text>
                                    </td>
                                    <td>
                                      <Flex
                                        direction="row"
                                        gap="size-100"
                                      >
                                        {days.map((dayKey) => (
                                          <TextField
                                            aria-label="m-field"
                                            key={dayKey}
                                            UNSAFE_style={{
                                              width: "50px",
                                            }}
                                            inputMode="numeric"
                                            type="number"
                                            value={crrValue[dayKey]}
                                            onChange={(value) =>
                                              handleInputChange(
                                                valueKey,
                                                dayKey,
                                                value,
                                                index,
                                                rowIndex
                                              )
                                            }
                                          />
                                        ))}
                                      </Flex>
                                    </td>
                                    <td>
                                      <TextField
                                        isDisabled
                                        aria-label="m-field"
                                        value={
                                          sumsData[rowIndex][valueKey] || ""
                                        }
                                        UNSAFE_style={{ width: "50px" }}
                                      />
                                    </td>
                                    <td>
                                      <TextField
                                        isDisabled
                                        aria-label="m-field"
                                        UNSAFE_style={{ width: "100px" }}
                                        value={new Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: "USD",
                                        }).format(wage[rowIndex][valueKey])}
                                      />
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
