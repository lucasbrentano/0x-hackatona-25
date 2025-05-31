import React from "react";
import { User, Trophy, Medal, Crown } from "lucide-react";
import { ButtonProps } from "../../components/Button/ButtonProps";
import { buttonStyles } from "../../components/Button/buttonStyles";
import CustomButton from "../../components/Button/CustomButton";

export default function ProfileScreen() {
  const hashtags = [
    { id: 18, text: "Excelente trabalho", color: "#10B981" },
    { id: 15, text: "Genial", color: "#6B7280" },
    { id: 14, text: "Muito bom", color: "#6B7280" },
    { id: 9, text: "Incrível", color: "#6B7280" },
    { id: 5, text: "Nota 10", color: "#10B981" },
    { id: 2, text: "Brilhante", color: "#6B7280" },
    { id: 1, text: "Arrasou", color: "#10B981" }
  ];

  const handleClose = () => {
    console.log("Fechar clicked");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#E5E7EB",
      padding: "16px"
    }}>
      <div style={{
        maxWidth: "384px",
        margin: "0 auto",
        backgroundColor: "#E5E7EB"
      }}>
        {/* Header com Level */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#10B981",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold"
            }}>
              5
            </div>
            <div style={{
              flex: 1,
              margin: "0 8px"
            }}>
              <div style={{
                backgroundColor: "#10B981",
                height: "12px",
                borderRadius: "6px",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  right: "8px",
                  top: "0",
                  height: "12px",
                  backgroundColor: "#9CA3AF",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  width: "32px"
                }}></div>
              </div>
            </div>
            <span style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              75/100
            </span>
          </div>
        </div>

        {/* Profile Avatar */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "24px"
        }}>
          <div style={{
            width: "96px",
            height: "96px",
            border: "4px solid #10B981",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white"
          }}>
            <User size={48} color="#10B981" />
          </div>
        </div>

        {/* User Name Input */}
        <div style={{ marginBottom: "32px" }}>
          <input
            type="text"
            placeholder="User Name"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              textAlign: "center",
              color: "#6B7280",
              backgroundColor: "white",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Conquistas Section */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "16px",
            color: "#1F2937"
          }}>
            Conquistas:
          </h2>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              border: "2px solid #10B981",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white"
            }}>
              <Trophy size={24} color="#10B981" />
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              border: "2px solid #10B981",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white"
            }}>
              <Medal size={24} color="#10B981" />
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              border: "2px solid #10B981",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white"
            }}>
              <Crown size={24} color="#10B981" />
            </div>
          </div>
        </div>

        {/* Hashtags Section */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "16px",
            color: "#1F2937"
          }}>
            Hashtags:
          </h2>
          <div style={{
            backgroundColor: "#9CA3AF",
            borderRadius: "8px",
            padding: "16px"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px"
            }}>
              {hashtags.slice(0, 6).map((hashtag) => (
                <div
                  key={hashtag.id}
                  style={{
                    backgroundColor: hashtag.color,
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontFamily: fonts.text
                  }}
                >
                  <span style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {hashtag.id}
                  </span>
                  <span style={{
                    flex: 1,
                    textAlign: "center"
                  }}>
                    {hashtag.text}
                  </span>
                </div>
              ))}
            </div>
            {/* Last hashtag in single row */}
            <div style={{
              display: "flex",
              justifyContent: "center"
            }}>
              <div style={{
                backgroundColor: hashtags[6].color,
                color: "white",
                padding: "8px 12px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                width: "50%"
              }}>
                <span style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}>
                  {hashtags[6].id}
                </span>
                <span style={{
                  flex: 1,
                  textAlign: "center"
                }}>
                  {hashtags[6].text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>
          <div style={{ width: "200px" }}>
            <CustomButton
              title="Fechar"
              onPress={handleClose}
              variant="primary"
              style={{
                backgroundColor: "#10B981",
                color: "white"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}