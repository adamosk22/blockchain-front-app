export type BettingApp = {
  "version": "0.1.0",
  "name": "betting_app",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reserveSpace",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createUserStats",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userStats",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addScheduledGame",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "placeWager",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userStats",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "predictionStr",
          "type": "string"
        }
      ]
    },
    {
      "name": "withdrawWager",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userStats",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "collectTaxes",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setGameState",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        },
        {
          "name": "stateStr",
          "type": "string"
        },
        {
          "name": "resultStr",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteGame",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "collectWager",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userStats",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "history",
            "type": {
              "vec": {
                "defined": "WagerSummary"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "programContract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maxGames",
            "type": "u64"
          },
          {
            "name": "activeGames",
            "type": {
              "vec": {
                "defined": "Game"
              }
            }
          },
          {
            "name": "taxesAccumulated",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "programWallet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "WagerSummary",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u32"
          },
          {
            "name": "lamportsBet",
            "type": "u64"
          },
          {
            "name": "lamportsWon",
            "type": "u64"
          },
          {
            "name": "predictedResult",
            "type": {
              "defined": "GameResult"
            }
          },
          {
            "name": "actuallResult",
            "type": {
              "option": {
                "defined": "GameResult"
              }
            }
          }
        ]
      }
    },
    {
      "name": "Game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "wagers",
            "type": {
              "vec": {
                "defined": "Wager"
              }
            }
          },
          {
            "name": "state",
            "type": {
              "defined": "GameState"
            }
          },
          {
            "name": "result",
            "type": {
              "option": {
                "defined": "GameResult"
              }
            }
          }
        ]
      }
    },
    {
      "name": "Wager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "lamports",
            "type": "u64"
          },
          {
            "name": "prediction",
            "type": {
              "defined": "GameResult"
            }
          },
          {
            "name": "collectedReward",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Scheduled"
          },
          {
            "name": "Live"
          },
          {
            "name": "Finished"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    },
    {
      "name": "GameResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "HomeVictory"
          },
          {
            "name": "AwayVictory"
          },
          {
            "name": "Tie"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidEnumType",
      "msg": "Invalid string value for enum was passed"
    },
    {
      "code": 6001,
      "name": "InvalidGameId",
      "msg": "Game with given Id doesn't exist or is already finished"
    },
    {
      "code": 6002,
      "name": "InvalidGameState",
      "msg": "Game with given sate cannot be set to given result"
    },
    {
      "code": 6003,
      "name": "GameAlreadyStarted",
      "msg": "Game with given Id has already started, cannot place a bet"
    },
    {
      "code": 6004,
      "name": "GameAlreadyExists",
      "msg": "Game with given Id already exists in the pool of active games"
    },
    {
      "code": 6005,
      "name": "GameNotFinished",
      "msg": "Game with given Id has is neither finished or cancelled"
    },
    {
      "code": 6006,
      "name": "MaxWagersPerGameReached",
      "msg": "Maximum amount of wagers for this game has been reached, cannot place a bet"
    },
    {
      "code": 6007,
      "name": "MaxActiveGamesReached",
      "msg": "Maximum amount of active games has been reached, cannot open a bet for this game"
    },
    {
      "code": 6008,
      "name": "MinimalWagerAmount",
      "msg": "A wager must be at least X lamparts"
    },
    {
      "code": 6009,
      "name": "InstructionNotPermitted",
      "msg": "No permission to call this instruction, only the owner is allowed"
    },
    {
      "code": 6010,
      "name": "WagerAlreadyPlaced",
      "msg": "Cannot place a wager on a game, another one has already been placed"
    },
    {
      "code": 6011,
      "name": "WagerNotPlaced",
      "msg": "Cannot retract a wager, no wager was placed"
    },
    {
      "code": 6012,
      "name": "NoAmountOwed",
      "msg": "No amount owed to perform a transfer"
    }
  ]
};

export const IDL: BettingApp = {
  "version": "0.1.0",
  "name": "betting_app",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reserveSpace",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createUserStats",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userStats",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addScheduledGame",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "placeWager",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userStats",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "predictionStr",
          "type": "string"
        }
      ]
    },
    {
      "name": "withdrawWager",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userStats",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "collectTaxes",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setGameState",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        },
        {
          "name": "stateStr",
          "type": "string"
        },
        {
          "name": "resultStr",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteGame",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "collectWager",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userStats",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "history",
            "type": {
              "vec": {
                "defined": "WagerSummary"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "programContract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maxGames",
            "type": "u64"
          },
          {
            "name": "activeGames",
            "type": {
              "vec": {
                "defined": "Game"
              }
            }
          },
          {
            "name": "taxesAccumulated",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "programWallet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "WagerSummary",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u32"
          },
          {
            "name": "lamportsBet",
            "type": "u64"
          },
          {
            "name": "lamportsWon",
            "type": "u64"
          },
          {
            "name": "predictedResult",
            "type": {
              "defined": "GameResult"
            }
          },
          {
            "name": "actuallResult",
            "type": {
              "option": {
                "defined": "GameResult"
              }
            }
          }
        ]
      }
    },
    {
      "name": "Game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "wagers",
            "type": {
              "vec": {
                "defined": "Wager"
              }
            }
          },
          {
            "name": "state",
            "type": {
              "defined": "GameState"
            }
          },
          {
            "name": "result",
            "type": {
              "option": {
                "defined": "GameResult"
              }
            }
          }
        ]
      }
    },
    {
      "name": "Wager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "lamports",
            "type": "u64"
          },
          {
            "name": "prediction",
            "type": {
              "defined": "GameResult"
            }
          },
          {
            "name": "collectedReward",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Scheduled"
          },
          {
            "name": "Live"
          },
          {
            "name": "Finished"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    },
    {
      "name": "GameResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "HomeVictory"
          },
          {
            "name": "AwayVictory"
          },
          {
            "name": "Tie"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidEnumType",
      "msg": "Invalid string value for enum was passed"
    },
    {
      "code": 6001,
      "name": "InvalidGameId",
      "msg": "Game with given Id doesn't exist or is already finished"
    },
    {
      "code": 6002,
      "name": "InvalidGameState",
      "msg": "Game with given sate cannot be set to given result"
    },
    {
      "code": 6003,
      "name": "GameAlreadyStarted",
      "msg": "Game with given Id has already started, cannot place a bet"
    },
    {
      "code": 6004,
      "name": "GameAlreadyExists",
      "msg": "Game with given Id already exists in the pool of active games"
    },
    {
      "code": 6005,
      "name": "GameNotFinished",
      "msg": "Game with given Id has is neither finished or cancelled"
    },
    {
      "code": 6006,
      "name": "MaxWagersPerGameReached",
      "msg": "Maximum amount of wagers for this game has been reached, cannot place a bet"
    },
    {
      "code": 6007,
      "name": "MaxActiveGamesReached",
      "msg": "Maximum amount of active games has been reached, cannot open a bet for this game"
    },
    {
      "code": 6008,
      "name": "MinimalWagerAmount",
      "msg": "A wager must be at least X lamparts"
    },
    {
      "code": 6009,
      "name": "InstructionNotPermitted",
      "msg": "No permission to call this instruction, only the owner is allowed"
    },
    {
      "code": 6010,
      "name": "WagerAlreadyPlaced",
      "msg": "Cannot place a wager on a game, another one has already been placed"
    },
    {
      "code": 6011,
      "name": "WagerNotPlaced",
      "msg": "Cannot retract a wager, no wager was placed"
    },
    {
      "code": 6012,
      "name": "NoAmountOwed",
      "msg": "No amount owed to perform a transfer"
    }
  ]
};
