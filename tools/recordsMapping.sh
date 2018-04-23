curl -XPUT http://172.17.0.1:9200/reindex-records -d '{
  "mappings": {
    "record": {
      "dynamic_templates": [{
        "phone": {
          "match": "phone*",
          "mapping": {
            "type": "string",
            "fields": {
              "plain": {
                "type": "string",
                "analyzer": "remove_geresh"
              },
              "raw": {
                "type": "string",
                "analyzer": "standard"
              }
            }
          }
        }
      }],
      "properties": {
        "categories": {
          "type": "string",
          "fields": {
            "raw": {
              "type": "string",
              "index": "not_analyzed"
            },
            "plain": {
              "type": "string",
              "analyzer": "remove_geresh"
            }
          }
        },
        "created": {
          "type": "date"
        },
        "updated": {
          "type": "date"
        },
        "business_name": {
          "type": "string",
          "fields": {
            "plain": {
              "type": "string",
              "analyzer": "remove_geresh"
            },
            "raw": {
              "type": "string"
            },
            "notanalyzed": {
              "type": "string",
              "index": "not_analyzed"
            }
          }
        },
        "tags": {
          "type": "string",
          "fields": {
            "plain": {
              "type": "string",
              "analyzer": "remove_geresh"
            },
            "raw": {
              "type": "string"
            }
          }
        },
        "location": {
          "type": "geo_point"
        },
        "address_city": {
          "type": "string",
          "fields": {
           "raw": {
              "type": "string"
            },
            "notanalyzed": {
              "type": "string",
              "index": "not_analyzed"
            }
          }       
        },

        "address_street_number": {
          "type": "string",
          "fields": {
            "raw": {
              "type": "string",
              "index": "not_analyzed"
            }
          }
        },
        "first_name": {
          "type": "string",
          "copy_to": "full_name"
        },
        "last_name": {
          "type": "string",
          "copy_to": "full_name"
        },
        "full_name": {
          "type": "string",
          "fields": {
            "raw": {
              "type": "string"
            },
            "notanalyzed": {
              "type": "string",
              "index": "not_analyzed"
            }
          }
        },
        "uk3": {
          "type": "string"
        },
        "score": {
          "properties": {
            "value": {
              "type": "double"
            },
            "options": {
              "type": "string",
              "fields": {
                "raw": {
                  "type": "string",
                  "index": "not_analyzed"
                }
              }
            }
          }
        },
        "score_value": {
          "type": "double"
        }
      }
    }
  },
  "settings": {
    "number_of_shards": 1,
    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "autocomplete_filter"
          ]
        },
        "remove_geresh": {
          "tokenizer": "standard",
          "char_filter": [
            "my_char_filter"
          ]
        }
      },
      "char_filter": {
        "my_char_filter": {
          "type": "mapping",
          "mappings": ["\\u0022=>", "\\u0027=>", "\\u002D=>"]
        }
      }
    }
  }
}'
