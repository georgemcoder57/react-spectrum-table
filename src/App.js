import React, { useEffect, useMemo, useState } from "react";
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
import ChevronUp from "@spectrum-icons/workflow/ChevronUp";
import Flag from "@spectrum-icons/workflow/Flag";
import { sampleData } from "./data";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import Comment from "@spectrum-icons/workflow/Comment";

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
    rowIndex,
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
                  : child,
              ),
            }
          : item,
      ),
    );
  };
  const toggleRow = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
  const handleExpandPanel = (isExpanded, index) => {
    setExpandedPanel((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="table-container">
      <Accordion allowsMultipleExpanded>
        {tableData.map((data, index) => (
          <Disclosure
            id={index}
            key={index}
            onExpandedChange={(isExpanded) =>
              handleExpandPanel(isExpanded, index)
            }
          >
            <DisclosureTitle
              UNSAFE_style={{
                background: expandedPanel.includes(index) ? "#F0FDFB" : "white",
              }}
            >
              <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                UNSAFE_style={{ width: "100%" }}
              >
                <Flex direction="column" UNSAFE_style={{ paddingLeft: "10px" }}>
                  <Text
                    UNSAFE_style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#909090",
                    }}
                  >
                    {data["Union Local"]}
                  </Text>
                  <Flex direction="row" gap="size-100">
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
                <Flex direction="column">
                  <Text
                    UNSAFE_style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#222222",
                    }}
                  >
                    2 JOBS
                  </Text>
                  <Text
                    UNSAFE_style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#222222",
                      textTransform: "uppercase",
                    }}
                  >
                    3 classifications
                  </Text>
                </Flex>
                <Flex direction="column" alignItems="end">
                  <Text
                    UNSAFE_style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#909090",
                    }}
                  >
                    TOTAL RPT HRS
                  </Text>
                  <Text
                    UNSAFE_style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "black",
                      textTransform: "uppercase",
                    }}
                  >
                    {totalSum}
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Text
                    UNSAFE_style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#909090",
                    }}
                  >
                    GROSS WAGES
                  </Text>
                  <Text
                    UNSAFE_style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "black",
                      textTransform: "uppercase",
                    }}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalWage)}
                  </Text>
                </Flex>
              </Flex>
            </DisclosureTitle>
            <DisclosurePanel UNSAFE_className="employee-table">
              <table>
                <thead style={{ borderBottom: "1px solid #ACAFFF" }}>
                  <tr className="summary-row">
                    <th>
                      <Flex direction="row" alignItems="center">
                        <ChevronLeft
                          size="S"
                          UNSAFE_style={{ fill: "#00635f", padding: 0 }}
                        />
                        <ChevronRight
                          size="S"
                          UNSAFE_style={{
                            fill: "#00635f",
                            marginRight: "16px",
                            marginLeft: "7px",
                          }}
                        />
                        <Flex
                          direction="row"
                          alignItems="end"
                          justifyContent="start"
                        >
                          <Text UNSAFE_className="summary-week-name">WE</Text>
                          <Text UNSAFE_className="summary-week-number">
                            21st
                          </Text>
                        </Flex>
                      </Flex>
                    </th>
                    <th>
                      <Flex direction="row" alignItems="center">
                        <ActionButton isQuiet aria-label="left">
                          <Flag UNSAFE_style={{ fill: "#B1B1B1" }} />
                        </ActionButton>
                        <ActionButton isQuiet aria-label="left">
                          <Comment UNSAFE_style={{ fill: "#B1B1B1" }} />
                        </ActionButton>
                        <NumberField
                          value={addingCount}
                          width="size-900"
                          aria-label="number-field"
                          UNSAFE_style={{ marginLeft: "16px" }}
                          onChange={(newValue) => setAddingCount(newValue)}
                        />
                      </Flex>
                    </th>
                    <th>
                      <div
                        style={{ width: "53px", visibility: "hidden" }}
                      ></div>
                    </th>
                    <th className="week-title">
                      <Flex direction="row" gap="size-100">
                        {days.map((day, dayIndex) => (
                          <Flex key={day} direction="column" alignItems="start">
                            <div className="week-title-value">
                              <span className="bold">{day}</span>
                              {`${15 + dayIndex}th`}
                            </div>
                            <TextField
                              isDisabled
                              aria-label="m-field"
                              UNSAFE_style={{
                                width: "50px",
                                marginTop: "12px",
                              }}
                              value={daySum[day]}
                            />
                          </Flex>
                        ))}
                      </Flex>
                    </th>
                    <th>
                      <TextField
                        isDisabled
                        aria-label="m-field"
                        UNSAFE_style={{ width: "50px" }}
                        value={totalSum}
                      />
                    </th>
                    <th>
                      <TextField
                        isDisabled
                        aria-label="m-field"
                        UNSAFE_style={{ width: "100px" }}
                        value={new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(totalWage)}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows &&
                    data.rows.map((row, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        <tr className="primary-row">
                          <td>
                            <Flex direction="row" alignItems="start">
                              <ActionButton
                                isQuiet
                                onPress={() => toggleRow(rowIndex)}
                                aria-label="left"
                              >
                                {expandedRows.includes(rowIndex) ? (
                                  <ChevronUp />
                                ) : (
                                  <ChevronDown />
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
                            <Flex direction="column" alignItems="start">
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
                            <td></td>
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
                                <Flex direction="row" alignItems="end">
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
                                <Flex direction="row" alignItems="end">
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
                                <Flex direction="row" alignItems="end">
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
                              <Flex direction="row" gap="size-100">
                                {days.map((dayKey) => (
                                  <TextField
                                    aria-label="m-field"
                                    key={dayKey}
                                    UNSAFE_style={{
                                      width: "50px",
                                    }}
                                    inputMode="numeric"
                                    type="number"
                                    value={row.values.st[dayKey]}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "st",
                                        dayKey,
                                        value,
                                        index,
                                        rowIndex,
                                      )
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
                                value={sumsData[rowIndex].st || ""}
                              />
                            </td>
                          )}
                          {expandedRows.includes(rowIndex) ? (
                            <td>
                              <TextField
                                aria-label="row-sum"
                                UNSAFE_style={{ width: "100px" }}
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
                                }).format(wage[rowIndex].st)}
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
                                      <td
                                        style={{
                                          paddingLeft: "30px",
                                          borderTop: "1px solid #008C87",
                                        }}
                                      >
                                        <Flex direction="row">
                                          <Flex
                                            direction="row"
                                            UNSAFE_style={{
                                              paddingRight: "16px",
                                              borderRight: "1px solid #008C87",
                                              marginRight: "8px",
                                            }}
                                          >
                                            <Text UNSAFE_className="earning-code">
                                              EC
                                            </Text>
                                            <Text UNSAFE_className="earning-code-value">
                                              {row.EarningCode}
                                            </Text>
                                          </Flex>
                                          <Flex direction="row">
                                            <Text UNSAFE_className="earning-code">
                                              CC
                                            </Text>
                                            <Text UNSAFE_className="earning-code-value">
                                              {row.CostCenter}
                                            </Text>
                                          </Flex>
                                        </Flex>
                                      </td>
                                    ) : (
                                      <td />
                                    )}
                                    <td />
                                    <td style={{ textAlign: "center" }}>
                                      <Text UNSAFE_className="secondary-row-time">
                                        {valueKey.toUpperCase()}
                                      </Text>
                                    </td>
                                    <td>
                                      <Flex direction="row" gap="size-100">
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
                                                rowIndex,
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
                              },
                            )}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </Accordion>
    </div>
  );
};

export default App;
