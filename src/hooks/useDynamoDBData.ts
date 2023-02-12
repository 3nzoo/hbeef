import { useEffect, useMemo, useState } from 'react';
import AWS from 'aws-sdk';
import { iUser } from '../../constant/interface';

export const updateCredentials = () => {
  AWS.config.update({
    region: import.meta.env.VITE_AWS_REGION,
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  });
};

export const useDynamoCategories = (tableName: string) => {
  const [data, setData] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useMemo(() => {
    return async () => {
      updateCredentials();
      setLoading(true);
      try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const result = await dynamodb.scan({ TableName: tableName }).promise();

        setData(
          result.Items?.sort((a, b) => {
            let dateA = new Date(a.createdAt).getTime();
            let dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          })
        );
      } catch (error) {
        console.log(error);
      } finally {
        if (data) {
          setData(data.sort());
        }

        setLoading(false);
      }
    };
  }, [tableName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { data, loading, error };
};

export const getDataFromDynamo = async (tableName: string) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const result = await dynamodb.scan({ TableName: tableName }).promise();

  if (tableName === import.meta.env.VITE_AWS_USER_TABLE) {
    const filteredData = result.Items?.sort((a, b) => {
      let dateA = new Date(a.createdAt).getTime();
      let dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
      .filter((item: any) => item.role !== 'first_admin')
      .map((user: any) => {
        const { password, ...rest } = user;
        return rest;
      });

    if (filteredData) return filteredData;
  } else {
    const sortedData = result.Items?.sort((a, b) => {
      let dateA = new Date(a.createdAt).getTime();
      let dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    return sortedData as Array<any>;
  }
};

export const useDynamoData = (tableName: string) => {
  const [data, setData] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useMemo(() => {
    return async () => {
      updateCredentials();
      setLoading(true);
      try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const result = await dynamodb.scan(
          { TableName: tableName },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              if (tableName === 'hbeef-users') {
                const filteredData = data.Items?.filter(
                  (item) => item.role !== 'first_admin'
                ).map((user) => {
                  const { password, ...rest } = user;
                  return rest;
                });
                setData(filteredData);
              } else {
                setData(
                  data.Items?.sort((a, b) => {
                    let dateA = new Date(a.createdAt).getTime();
                    let dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA;
                  })
                );
              }
            }
          }
        );
      } catch (error) {
        console.log(error);
      } finally {
        if (data) {
          setData(data.sort());
        }

        setLoading(false);
      }
    };
  }, [tableName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};
