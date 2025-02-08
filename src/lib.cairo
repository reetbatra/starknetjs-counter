// Cairo 2.9.2

#[starknet::interface]
trait ITestSession<TContractState> {
    fn increase_counter(ref self: TContractState, value: u128);
    fn decrease_counter(ref self: TContractState, value: u128);
    fn get_counter(self: @TContractState) -> u128;
}

#[starknet::contract]
mod test_session {
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::storage::StoragePointerReadAccess;

    #[storage]
    struct Storage {
        count: u128,
    }

    #[abi(embed_v0)]
    impl TestSession of super::ITestSession<ContractState> {
        fn increase_counter(ref self: ContractState, value: u128) {
            self.count.write(self.count.read() + value);
        }

        fn decrease_counter(ref self: ContractState, value: u128) {
            let current = self.count.read();
            if current >= value {
                self.count.write(current - value);
            } else {
                self.count.write(0); // Prevents underflow
            }
        }

        fn get_counter(self: @ContractState) -> u128 {
            self.count.read()
        }
    }
}