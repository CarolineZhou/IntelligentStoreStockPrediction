import pandas as pd

df = pd.read_csv('order_products__train.csv')

df = df['product_id'].value_counts(ascending=True).rename_axis('product_id').reset_index(name='quantity')
#sort lowest product_id to highest
df = df.sort_values(['quantity', 'product_id'], ascending=False)
df = df[(df['quantity'] >= 30) & (df['quantity'] <= 2500)]
df.to_csv('new_orders.csv')

print("'out.csv' created successfully")
#print(df)

